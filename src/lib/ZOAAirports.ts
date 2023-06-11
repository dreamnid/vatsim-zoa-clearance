import { PLANE_CATEGORY } from "../types";

type dep_proc = {
  plane_classifications: PLANE_CATEGORY[];
  departure_freq: string;
  climb_via_sid: boolean;
  flows: string[];
  rwys: string[];
  altitude: string;
  notes: string;
};

type flow = {
  direction: string;
  rwys: string[];
};

type apt_info = {
  date?: Date;
  flows: Map<string, flow>;
  diagrams?: {
    airport: string;
  };
  departure_proc?: {
    ifr?: {
      sids: {
        name: string;
        abbr: string;
        revision: number;
        url: string;
        transitions: string[];
        is_rnav: boolean;
        top_altitude: number;
        expect_time: number;
        proc?: dep_proc[];
      }[];
    };
    vfr?: {
      proc: dep_proc[];
    };
  };
};

const apt = new Map<String, apt_info>([
  [
    "oak",
    {
      // The date When the sop was last updated
      date: new Date(2023, 1, 24), // Note that month is 0-based so 0 is January
      flows: new Map([
        ["sfow", { direction: "west", rwys: ["28", "30"] }],
        ["oake", { direction: "east", rwys: ["10", "12"] }],
        ["sfoe", { direction: "east", rwys: ["10", "12"] }],
      ]),
      departure_proc: {
        ifr: {
          sids: [
            {
              name: "CNDL",
              abbr: "CNDL",
              revision: 5,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294CNDEL.PDF",
              transitions: ["KAYAX", "KTINA", "NTELL", "SUSSEY", "YYUNG"],
              is_rnav: true,
              top_altitude: 10000,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1",
                  altitude: "CVS",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: [],
                  notes: "southbound",
                },
              ],
            },
            {
              name: "OAK",
              abbr: "OAK",
              revision: 5,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294OAKLAND.PDF",
              transitions: [],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "120.9 northbound / 135.1 oceanic",
                  altitude: "CVS x FL190 (J); CVS x 10,000 (DH8D)",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: [],
                  notes: "northbound / oceanic",
                },
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "120.9 northbound / 135.1 oceanic",
                  altitude: "3,000",
                  climb_via_sid: false,
                  flows: ["sfoe"],
                  rwys: [],
                  notes: "northbound / oceanic",
                },
              ],
            },
            {
              name: "SKYLINE",
              abbr: "SKYL",
              revision: 1,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294SKYLINE.PDF",
              transitions: ["AVE", "FLW", "PXN"],
              is_rnav: true,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1",
                  altitude: "CVS x 10,000",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: [],
                  notes: "southbound",
                },
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1",
                  altitude: "CVS x 3,000",
                  climb_via_sid: true,
                  flows: ["sfoe"],
                  rwys: [],
                  notes: "southbound",
                },
              ],
            },
            {
              name: "COAST",
              abbr: "COAST",
              revision: 9,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294COAST.PDF",
              transitions: ["FLW", "GVO", "RZS", "SXC"],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1",
                  altitude: "CVS x 10,000",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: [],
                  notes: "southbound",
                },
              ],
            },
            {
              name: "NUEVO",
              abbr: "NUEVO",
              revision: 8,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294NUEVO.PDF",
              transitions: ["SNS", "SHOEY"],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.PROP,
                    PLANE_CATEGORY.TURBOPROP,
                  ],
                  departure_freq: "135.1",
                  altitude: "CVS x 10,000",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: [],
                  notes: "Via BSR, EUGEN, SHOEY, or SNS",
                },
              ],
            },
            {
              name: "NIMITZ",
              abbr: "NIMI",
              revision: 8,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294NIMITZ.PDF",
              transitions: [],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [
                    PLANE_CATEGORY.PROP,
                    PLANE_CATEGORY.TURBOPROP,
                  ],
                  departure_freq: "120.9",
                  altitude: "3,000",
                  climb_via_sid: false,
                  flows: ["sfow"],
                  rwys: [],
                  notes: "",
                },
              ],
            },
            {
              name: "HUSSH",
              abbr: "HUSSH",
              revision: 2,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294HUSSH.PDF",
              transitions: [
                "DEDHD",
                "GOBBS",
                "GRTFL",
                "MOGEE",
                "ORRCA",
                "SYRAH",
                "TIPRE",
              ],
              is_rnav: true,
              top_altitude: 19000,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "120.9 northbound / 135.1 oceanic",
                  altitude: "CVS",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: ["30"],
                  notes: "Noise Abatement - Northbound / Oceanic",
                },
              ],
            },
            {
              name: "SILENT",
              abbr: "SLNT",
              revision: 3,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294SILENT.PDF",
              transitions: ["LIN", "ENI", "RBL", "SAC"],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "120.9",
                  altitude: "CVS x FL190",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: ["30"],
                  notes: "Noise Abatement - Northbound",
                },
              ],
            },
            {
              name: "SUNNE",
              abbr: "SUNNE",
              revision: 1,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294SUNNE.PDF",
              transitions: [],
              is_rnav: false,
              top_altitude: 5000,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1",
                  altitude: "5,000",
                  climb_via_sid: false,
                  flows: ["sfow"],
                  rwys: ["30", "28"],
                  notes:
                    "Noise Abatement - Southbound - Infrequently used since requires low traffic levels",
                },
              ],
            },
            {
              name: "SALAD",
              abbr: "SALAD",
              revision: 5,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294SALAD.PDF",
              transitions: ["ALTAM"],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.PROP],
                  departure_freq: "120.9",
                  altitude: "CVS x 4,000",
                  climb_via_sid: true,
                  flows: ["sfow"],
                  rwys: ["28"],
                  notes: "Noise Abatement - Northbound, Prop Cat A,B Only",
                },
              ],
            },
            {
              name: "KATFH",
              abbr: "KATFH",
              revision: 3,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294KATFH.PDF",
              transitions: ["KAYAX", "KTINA", "NTELL", "SUSSEY"],
              is_rnav: true,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1",
                  altitude: "CVS x 3,000",
                  climb_via_sid: true,
                  flows: ["sfoe"],
                  rwys: [],
                  notes: "southbound",
                },
              ],
            },
            {
              name: "QUAKE",
              abbr: "QUAKE",
              revision: 2,
              url: "https://aeronav.faa.gov/d-tpp/2305/00294QUAKE.PDF",
              transitions: [],
              is_rnav: false,
              top_altitude: undefined,
              expect_time: 10,
              proc: [
                {
                  plane_classifications: [PLANE_CATEGORY.JET],
                  departure_freq: "135.1 southbound / 120.9 northbound",
                  altitude: "5,000",
                  climb_via_sid: false,
                  flows: ["oake"],
                  rwys: [],
                  notes: "southbound / northbound",
                },
              ],
            },
          ],
        },
        vfr: {
          proc: [
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "120.9",
              climb_via_sid: false,
              altitude: "AOB 2,000",
              flows: ["sfow"],
              rwys: [],
              notes: "Direction N / NW - Follow I-880",
            },
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "120.9",
              climb_via_sid: false,
              altitude: "AOB 2,500",
              flows: ["sfow"],
              rwys: [],
              notes: "Direction NE - On course",
            },
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "125.35",
              climb_via_sid: false,
              altitude: "AOB 2,500",
              flows: ["sfow"],
              rwys: [],
              notes: "Direction E / SE - Remain north of Lake Chabot",
            },
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "125.35",
              climb_via_sid: false,
              altitude: "AOB 2,000",
              flows: ["sfow"],
              rwys: [],
              notes:
                "Direction S - Remain south of the San Mateo Bridge Toll Plaza",
            },
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "",
              climb_via_sid: false,
              altitude: "",
              flows: ["sfow", "sfoe", "oake"],
              rwys: [],
              notes: "SFO - Coordinate with NCT CIC/TMU (or SFO LC, NCT, ZOA)",
            },
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "120.9",
              climb_via_sid: false,
              altitude: "AOB 2,500",
              flows: ["sfoe"],
              rwys: [],
              notes: "Direction E / NE - Remain north of Lake Chabot",
            },
            {
              plane_classifications: [
                PLANE_CATEGORY.JET,
                PLANE_CATEGORY.PROP,
                PLANE_CATEGORY.TURBOPROP,
              ],
              departure_freq: "125.35",
              climb_via_sid: false,
              altitude: "AOB 1,500",
              flows: ["sfoe"],
              rwys: [],
              notes: "Direction N / NW - Follow I-880",
            },
          ],
        },
      },
    },
  ],

  // ["sfo", { flows: ["sfow", "sfoe"] }],
  // ["sjc", { flows: ["sfow", "sfoe", "sjce"] }],
]);

export default apt;
export { type apt_info };
