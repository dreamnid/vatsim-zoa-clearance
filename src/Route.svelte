<script lang="ts">
  import { onMount } from "svelte";
  import type { apt_info, star } from "./lib/ZOAAirports";

  export let route: string;
  export let airport: apt_info;

  let star: star;

  onMount(async () => {
    let split = route.split(".");
    let last = split[split.length - 1];
    star = airport.arrival_proc.ifr?.stars.get(last);
  });
</script>

<pre>{route}{#if star}{star.revision}{/if}</pre>
