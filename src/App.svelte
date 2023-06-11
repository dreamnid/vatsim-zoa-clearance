<script lang="ts">
  import { onMount } from "svelte";
  import apt, { type apt_info } from "./lib/ZOAAirports";
  import { PLANE_EQUIPMENT, PLANE_CATEGORY, FLIGHT_PLAN } from "./types";

  type tecroute = {
    plane_category?: PLANE_CATEGORY;
    raw: string;
    route: string;
    alias: string;
    origin_rwy?: string;
    dest_rwy?: string;
  };

  let aliases_tec = new Map<string, Map<string, tecroute[]>>();

  let origin: string = "";
  let origin_flow: string;
  let arrival: string = "";
  let arrival_flow: string;

  let flight_plan: FLIGHT_PLAN.IFR;

  let plane_equipment: PLANE_EQUIPMENT = PLANE_EQUIPMENT.G;
  let plane_classification: PLANE_CATEGORY = PLANE_CATEGORY.JET;

  let cur_origin_apt: apt_info;
  let tec_results: tecroute[];

  // Set default equipment suffix depening on the plane classification
  $: {
    switch (plane_classification) {
      case PLANE_CATEGORY.JET:
        plane_equipment = PLANE_EQUIPMENT.L;
        break;
      case PLANE_CATEGORY.PROP:
        plane_equipment = PLANE_EQUIPMENT.G;
        break;
      case PLANE_CATEGORY.TURBOPROP:
        plane_equipment = PLANE_EQUIPMENT.L;
        break;
    }
  }

  $: {
    if (aliases_tec.has(origin) && aliases_tec.get(origin).has(arrival)) {
      tec_results = aliases_tec.get(origin).get(arrival);
    } else {
      tec_results = [];
    }
  }

  $: {
    if (apt.has(origin)) {
      cur_origin_apt = apt.get(origin);
    } else {
      cur_origin_apt = undefined;
    }
  }

  $: {
    origin = origin.toLowerCase();
    if (origin.length == 4 && origin.slice(0, 1)[0] == "k") {
      origin = origin.slice(1);
    }
  }

  $: {
    arrival = arrival.toLowerCase();
    if (arrival.length == 4 && arrival.slice(0, 1)[0] == "k") {
      arrival = arrival.slice(1);
    }
  }

  onMount(async () => {
    const res = fetch("/ZOA_Alias.txt")
      .then((res) => res.text())
      .then((text) => {
        for (const line of text.split("\n")) {
          if (line.startsWith(".")) {
            const line_split = line.split(" ");
            if (
              line_split.length > 4 &&
              line_split[1] == ".am" &&
              line_split[2] == "rte"
            ) {
              const alias_regex =
                /\.(?<origin>\w{3})(?<origin_runway>\d{1,2})?(?<dest>\w{3})(?<dest_runway>\d{1,2})?(?<plane_category>[pPjJtT])?/;
              const alias_match = line_split[0].match(alias_regex);
              if (!alias_match) {
                console.error("Did not parse: " + line_split[0]);
                continue;
              }

              const origin_parsed = alias_match.groups.origin.toLowerCase();
              const destination_parsed = alias_match.groups.dest.toLowerCase();

              if (!aliases_tec.has(origin_parsed)) {
                aliases_tec.set(origin_parsed, new Map<string, tecroute[]>());
              }

              const tec_value = aliases_tec.get(origin_parsed);

              if (!tec_value.has(destination_parsed)) {
                tec_value.set(destination_parsed, []);
              }

              tec_value.get(destination_parsed).push({
                alias: line_split[0],
                plane_category: alias_match.groups.plane_category
                  ? (alias_match.groups.plane_category.toLowerCase() as PLANE_CATEGORY)
                  : undefined,
                origin_rwy: alias_match.groups.origin_runway,
                dest_rwy: alias_match.groups.dest_runway,
                raw: line,
                route: line_split.slice(4).join(" ").trim(),
              });
            }
          }
        }
      });
  });
</script>

<main>
  <label>Departure: <input bind:value={origin} /></label>
  {#if apt.has(origin)}
    <label
      >Flow: <select bind:value={origin_flow}>
        {#each Array.from(apt.get(origin).flows.keys()) as cur_flow}
          <option value={cur_flow}>{cur_flow.toUpperCase()}</option>
        {/each}
      </select></label
    >
  {/if}
  <br />
  <label>Arrival: <input bind:value={arrival} /></label>
  {#if apt.has(arrival)}
    <label
      >Flow: <select bind:value={arrival_flow}>
        {#each Array.from(apt.get(arrival).flows.keys()) as cur_flow}
          <option value={cur_flow}>{cur_flow.toUpperCase()}</option>
        {/each}
      </select></label
    >
  {/if}
  <br />
  <label
    >Plane Classification: <select bind:value={plane_classification}>
      {#each Object.entries(PLANE_CATEGORY) as [cat_name, cat_value]}
        {#if cat_value}
          <option value={cat_value}>{cat_name}</option>
        {/if}
      {/each}
    </select></label
  >
  <br />
  <label
    >Flight Plan: <select bind:value={flight_plan}>
      {#each Object.entries(FLIGHT_PLAN) as [name, val]}
        <option value={val}>{name.toUpperCase()}</option>
      {/each}
    </select></label
  >
  <br />

  {#if flight_plan == FLIGHT_PLAN.IFR}
    <label
      >Plane Equipment Suffix Code: <select bind:value={plane_equipment}>
        {#each Object.values(PLANE_EQUIPMENT) as equip}
          <option value={equip}>{equip.toUpperCase()}</option>
        {/each}
      </select></label
    >
    <br />
  {/if}

  {#if origin}
    <h3>SOP</h3>
    {#if flight_plan === FLIGHT_PLAN.IFR}
      {#if cur_origin_apt && cur_origin_apt.departure_proc && cur_origin_apt.departure_proc.ifr}
        <h4>SIDs</h4>
        {#each cur_origin_apt.departure_proc.ifr.sids as sid}
          {#if sid.proc}
            <ul>
              {#each sid.proc as cur_proc}
                {#if cur_proc.flows.indexOf(origin_flow) > -1 && cur_proc.plane_classifications.indexOf(plane_classification) > -1 && ((sid.is_rnav && [PLANE_EQUIPMENT.G, PLANE_EQUIPMENT.L].indexOf(plane_equipment) > -1) || !sid.is_rnav)}
                  <li>
                    {sid.name}{sid.revision} - {sid.abbr}{sid.revision} - {#if cur_proc.rwys.length}RWY
                      [{#each cur_proc.rwys as rwy, idx}{idx ==
                        cur_proc.rwys.length - 1
                          ? rwy
                          : `${rwy} `}{/each}] -
                    {/if}
                    {cur_proc.altitude}
                    -
                    {cur_proc.departure_freq} -
                    {cur_proc.notes}
                  </li>
                {/if}
              {/each}
            </ul>
          {/if}
        {/each}
      {:else}
        No info available for airport
      {/if}

      <h3>TEC</h3>
      <ul>
        {#each tec_results as result}
          {#if !result.plane_category || result.plane_category == plane_classification}
            {#if !result.origin_rwy || !cur_origin_apt || (cur_origin_apt.flows.has(origin_flow) && cur_origin_apt.flows
                  .get(origin_flow)
                  .rwys.indexOf(result.origin_rwy) > -1)}
              <li>
                <pre>{#if tec_results.length > 1}{result.alias}:
                  {/if}{result.route}</pre>
              </li>
            {/if}
          {/if}
        {:else}
          No routes
        {/each}
      </ul>
    {:else if flight_plan === FLIGHT_PLAN.VFR}
      <h4>VFR Procedures</h4>
      {#if cur_origin_apt.departure_proc && cur_origin_apt.departure_proc.vfr}
        <ul>
          {#each cur_origin_apt.departure_proc.vfr.proc as cur_proc}
            {#if cur_proc.flows.indexOf(origin_flow) > -1 && cur_proc.plane_classifications.indexOf(plane_classification) > -1}
              <li>
                {#if cur_proc.rwys.length}RWY [{#each cur_proc.rwys as rwy, idx}{idx ==
                    cur_proc.rwys.length - 1
                      ? rwy
                      : `${rwy} `}{/each}] -
                {/if}
                {cur_proc.altitude}
                -
                {cur_proc.departure_freq} -
                {cur_proc.notes}
              </li>
            {/if}
          {/each}
        </ul>
      {:else}
        No VFR info avail
      {/if}
    {/if}
  {/if}
</main>

<style>
</style>
