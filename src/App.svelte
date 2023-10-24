<script lang="ts">
  import { onMount } from "svelte";
  import apt, {
    type apt_info,
    loa_artcc_map,
    loa_artcc,
  } from "./lib/ZOAAirports";
  import { PLANE_EQUIPMENT, PLANE_CATEGORY, FLIGHT_PLAN } from "./types";
  import Route from "./Route.svelte";

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
  let cur_arrival_apt: apt_info;
  let tec_results: tecroute[];
  let is_plane_rnav_capable: boolean = false;
  let arrival_loas = [];

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
    is_plane_rnav_capable = [PLANE_EQUIPMENT.G, PLANE_EQUIPMENT.L].includes(
      plane_equipment
    );
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
      origin_flow = undefined;
    }
  }

  $: {
    if (apt.has(arrival)) {
      cur_arrival_apt = apt.get(arrival);
      if (!arrival_flow && cur_arrival_apt.flows.size) {
        arrival_flow = cur_arrival_apt.flows.keys().next().value;
      }
    } else {
      cur_arrival_apt = undefined;
      arrival_flow = undefined;
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

  $: {
    if (cur_origin_apt && arrival && loa_artcc_map.has(cur_origin_apt.artcc)) {
      const loa_candidates = Object.values(
        loa_artcc_map.get(cur_origin_apt.artcc)
      ).flatMap((artcc_loa_key) => loa_artcc.get(artcc_loa_key));
      arrival_loas = [];

      for (const cur_loa of loa_candidates) {
        if (cur_loa.dep_apts.length && !cur_loa.dep_apts.includes(origin)) {
          continue;
        }

        if (
          cur_loa.dep_flows.length &&
          !cur_loa.dep_flows.includes(origin_flow)
        ) {
          continue;
        }

        if (cur_loa.arr_apts.length && !cur_loa.arr_apts.includes(arrival)) {
          continue;
        }

        if (
          cur_loa.arr_flows.length &&
          !cur_loa.arr_flows.includes(arrival_flow)
        ) {
          continue;
        }

        if (
          cur_loa.plane_classifications.length &&
          !cur_loa.plane_classifications.includes(plane_classification)
        ) {
          continue;
        }

        if (cur_loa.is_rnav && !is_plane_rnav_capable) {
          continue;
        }

        arrival_loas.push(cur_loa);
      }
    } else {
      arrival_loas = [];
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
    <h3>SOP Departures</h3>
    {#if flight_plan === FLIGHT_PLAN.IFR}
      {#if cur_origin_apt && cur_origin_apt.departure_proc && cur_origin_apt.departure_proc.ifr}
        <h4>SIDs</h4>
        {#each cur_origin_apt.departure_proc.ifr.sids as sid}
          {#if sid.proc}
            <ul>
              {#each sid.proc as cur_proc}
                {#if (!cur_proc.flows.length || cur_proc.flows.includes(origin_flow)) && (!cur_proc.plane_classifications.length || cur_proc.plane_classifications.includes(plane_classification)) && ((sid.is_rnav && is_plane_rnav_capable) || !sid.is_rnav)}
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
        No info available for origin airport
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

      <h3>LOA Arrival</h3>
      <table class="loa_arrival">
        <thead>
          <tr>
            <th>Route</th>
            <th>RNAV?</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {#each arrival_loas as loa}
            <tr>
              <td>
                {#if Array.isArray(loa.route)}
                  <ul>
                    {#each loa.route as cur_route}
                      <li>
                        <Route route={cur_route} airport={cur_arrival_apt} />
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <Route route={loa.route} airport={cur_arrival_apt} />
                {/if}
              </td>
              <td
                >{#if loa.is_rnav}✓{/if}</td
              >
              <td>{loa.notes}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else if flight_plan === FLIGHT_PLAN.VFR}
      <h4>VFR Procedures</h4>
      {#if cur_origin_apt && cur_origin_apt.departure_proc && cur_origin_apt.departure_proc.vfr}
        <ul>
          {#each cur_origin_apt.departure_proc.vfr.proc as cur_proc}
            {#if (!cur_proc.flows.length || cur_proc.flows.includes(origin_flow)) && (!cur_proc.plane_classifications.length || cur_proc.plane_classifications.includes(plane_classification))}
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

<style lang="scss">
  table.loa_arrival {
    border-collapse: collapse;

    thead {
      text-align: left;
    }

    tbody tr {
      border-bottom: 1px solid #f0f0f0a4;
    }

    th,
    td {
      padding: 2px 10px;
    }
  }
</style>
