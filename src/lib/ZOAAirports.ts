import { PLANE_CATEGORY } from "../types";

type apt_info = {
  flows: string[];
  ifr?: {
    sid: {
      name: string;
      plane_classifications: PLANE_CATEGORY[];
      departure_freq: string;
    }[];
  };
};

const apt = new Map<String, apt_info>([
  ["oak", { flows: ["sfow", "oake", "sfoe"] }],
  ["sfo", { flows: ["sfow", "sfoe"] }],
  ["sjc", { flows: ["sfow", "sfoe", "sjce"] }],
]);

export default apt;
export { type apt_info };
