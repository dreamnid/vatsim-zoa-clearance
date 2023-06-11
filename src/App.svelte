
<script lang="ts">
  import { onMount } from 'svelte';
  import apt from './lib/ZOAAirports';
  import { PLANE_EQUIPMENT, PLANE_CATEGORY } from './types';

  type tecroute = {
    plane_category?: PLANE_CATEGORY;
    raw: string;
    route: string;
    alias: string;
    origin_rwy?: string;
    dest_rwy?: string;
  }

  let aliases_tec = new Map<string, Map<string, tecroute[]>>();

  let origin: string
  let origin_flow: string
  let arrival: string
  let arrival_flow: string

  let plane_equipment: PLANE_EQUIPMENT = PLANE_EQUIPMENT.G
  let plane_classification: PLANE_CATEGORY = PLANE_CATEGORY.JET

  let tec_results: tecroute[];

  $: {
    if (aliases_tec.has(origin) && aliases_tec.get(origin).has(arrival)) {
      tec_results = aliases_tec.get(origin).get(arrival);
    } else {
      tec_results = [];
    }
  }

  onMount(async () => {
    const res = fetch("/ZOA_Alias.txt").then(
      res => res.text()
    ).then( text => {
      for (const line of text.split("\n")) {
        if (line.startsWith(".")) {
          const line_split = line.split(" ")
          if (line_split.length > 4 && line_split[1] == ".am" && line_split[2] == "rte") {
            const alias_regex = /\.(?<origin>\w{3})(?<origin_runway>\d{1,2})?(?<dest>\w{3})(?<dest_runway>\d{1,2})?(?<plane_category>[pPjJtT])?/;
            const alias_match = line_split[0].match(alias_regex);
            if (!alias_match) {
              console.error("Did not parse: " + line_split[0])
              continue
            }
            
            const origin_parsed = alias_match.groups.origin.toLowerCase();
            const destination_parsed = alias_match.groups.dest.toLowerCase();


            if (!aliases_tec.has(origin_parsed)) {
              aliases_tec.set(origin_parsed, new Map<string, tecroute[]>());
            }

            const tec_value = aliases_tec.get(origin_parsed);

            if (!tec_value.has(destination_parsed)) {
              tec_value.set(destination_parsed, [])
            }

            tec_value.get(destination_parsed).push({alias: line_split[0], 
              plane_category: alias_match.groups.plane_category ? alias_match.groups.plane_category.toLowerCase() as PLANE_CATEGORY : undefined, 
              origin_rwy: alias_match.groups.origin_runway, 
              dest_rwy: alias_match.groups.dest_runway, 
              raw: line, 
              route: line_split.slice(4).join(" ")})
          }
        }
      }
    })

  })
</script>

<main>

  <label>Departure: <input bind:value={origin}></label>
  {#if apt.has(origin)}
  <label>Flow: <select bind:value={origin_flow}>
    {#each apt.get(origin).flows as cur_flow}
      <option value={cur_flow}>{cur_flow.toUpperCase()}</option>
    {/each}
  </select></label>
  {/if}
  <br/>
  <label>Arrival: <input bind:value={arrival}></label>
  {#if apt.has(arrival)}
  <label>Flow: <select bind:value={arrival_flow}>
    {#each apt.get(arrival).flows as cur_flow}
      <option value={cur_flow}>{cur_flow.toUpperCase()}</option>
    {/each}
  </select></label>
  {/if}
  <br/>
  <label>Plane Classification: <select bind:value={plane_classification}>
    {#each Object.entries(PLANE_CATEGORY) as [cat_name, cat_value]}
    {#if cat_value}
    <option value={cat_value}>{cat_name}</option>
    {/if}
    {/each} 
  </select></label>
  <br/>
  <label>Plane Equipment Suffix Code: <select bind:value={plane_equipment}>
    {#each Object.values(PLANE_EQUIPMENT) as equip}
    <option value={equip}>{equip.toUpperCase()}</option>
    {/each}
  </select></label>
  <br/>

  <h3>TEC</h3>
  <ul>
  {#each tec_results as result}
    {#if !result.plane_category || result.plane_category == plane_classification}
    <li><pre>{#if tec_results.length > 1}{result.alias}: {/if}{result.route}</pre></li>
    {/if}
  {:else}  
  No routes
  {/each}
  </ul>

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
