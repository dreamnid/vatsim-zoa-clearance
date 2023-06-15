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

type arr_proc = {
  plane_classifications: PLANE_CATEGORY[];
  flows: string[];
  rwys: string[];
  notes: string;
};

type flow = {
  direction: string;
  rwys: string[];
};

type apt_info = {
  date?: Date;
  // The artcc acronym in lower case (e.g. zoa)
  artcc: string;
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
  arrival_proc?: {
    ifr?: {
      stars: Map<
        string,
        {
          name: string;
          revision: number;
          url: string;
          transitions: string[];
          is_rnav: boolean;
          dme_required: boolean;
          proc?: arr_proc[];
        }
      >;
      // lao: key is artcc acronym (e.g. zoa)
      loa: Map<
        string,
        {
          dep_apts: string[];
          dep_flows: string[];
          arr_flows: string[];
          plane_classifications: PLANE_CATEGORY[];
          route: string | string[];
          is_rnav: boolean;
          notes: string;
        }[]
      >;
    };
  };
};

const apt = new Map<String, apt_info>([
  [
    "oak",
    {
      // The date When the sop was last updated
      date: new Date(2023, 1, 24), // Note that month is 0-based so 0 is January
      artcc: "zoa",
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

  [
    "sfo",
    {
      artcc: "zoa",
      flows: new Map([
        ["sfow", { direction: "west", rwys: ["01", "28"] }],
        ["sfoe", { direction: "east", rwys: ["10", "19"] }],
      ]),
      diagrams: {
        airport: "https://aeronav.faa.gov/d-tpp/2305/00375AD.PDF",
      },
    },
  ],
  // ["sjc", { flows: ["sfow", "sfoe", "sjce"] }],
  [
    "lax",
    {
      artcc: "zla",
      flows: new Map([
        ["laxw", { direction: "west", rwys: ["24", "25"] }],
        ["laxe", { direction: "east", rwys: ["06", "07"] }],
      ]),
      diagrams: {
        airport: "https://aeronav.faa.gov/d-tpp/2305/00237AD.PDF",
      },
      arrival_proc: {
        ifr: {
          stars: new Map([
            [
              "SADDE",
              {
                name: "SADDE",
                revision: 8,
                url: "https://aeronav.faa.gov/d-tpp/2305/00237SADDE.PDF",
                transitions: [
                  "AVE",
                  "DERBB",
                  "DINTY",
                  "ELKEY",
                  "FIM",
                  "PMD",
                  "RZS",
                  "VTU",
                ],
                is_rnav: false,
                dme_required: true,
                proc: [],
              },
            ],
            [
              "IRNMN",
              {
                name: "IRNMN",
                revision: 2,
                url: "https://aeronav.faa.gov/d-tpp/2305/00237IRNMN_C.PDF",
                transitions: ["BURGL", "FRASR", "MUPTT", "REBRG"],
                is_rnav: true,
                dme_required: false,
                proc: [],
              },
            ],
            [
              "ZUUMA",
              {
                name: "ZUUMA",
                revision: 3,
                url: "https://aeronav.faa.gov/d-tpp/2305/00237ZUUMA.PDF",
                transitions: ["BURGL", "REBRG"],
                is_rnav: true,
                dme_required: false,
                proc: [],
              },
            ],
            [
              "KIMMO",
              {
                name: "KIMMO",
                revision: 3,
                url: "https://aeronav.faa.gov/d-tpp/2305/00237KIMMO.PDF",
                transitions: ["LHS", "PMD", "EHF", "TTE"],
                is_rnav: false,
                dme_required: false,
                proc: [],
              },
            ],
            [
              "WAYVE",
              {
                name: "WAYVE",
                revision: 1,
                url: "https://aeronav.faa.gov/d-tpp/2305/00237WAYVE.PDF",
                transitions: ["LHS", "LOPES", "EHF", "TTE"],
                is_rnav: false,
                dme_required: true,
                proc: [],
              },
            ],
          ]),
          loa: new Map([
            [
              "zoa",
              [
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["laxw"],
                  plane_classifications: [PLANE_CATEGORY.JET],
                  route: "..AVE.SADDE",
                  is_rnav: false,
                  notes: "Direct no further than DOUIT",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["laxw"],
                  plane_classifications: [PLANE_CATEGORY.JET],
                  route: "..IRNMN",
                  is_rnav: true,
                  notes: "Direct no further than DOUIT",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["laxe"],
                  plane_classifications: [PLANE_CATEGORY.JET],
                  route: "..AVE.MOOR",
                  is_rnav: false,
                  notes: "Direct no further than DOUIT",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["laxe"],
                  plane_classifications: [PLANE_CATEGORY.JET],
                  route: "..ZUUMA",
                  is_rnav: true,
                  notes: "Direct no further than DOUIT",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: [],
                  plane_classifications: [
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..KIMMO",
                  is_rnav: false,
                  notes: "AOV FL230",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: [],
                  plane_classifications: [
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..WAYVE",
                  is_rnav: true,
                  notes: "AOB FL230",
                },
              ],
            ],
          ]),
        },
      },
    },
  ],
  [
    "san",
    {
      artcc: "zla",
      flows: new Map([
        ["sanw", { direction: "west", rwys: ["27"] }],
        ["sane", { direction: "east", rwys: ["09"] }],
      ]),
      diagrams: {
        airport: "https://aeronav.faa.gov/d-tpp/2305/00373AD.PDF",
      },
      arrival_proc: {
        ifr: {
          stars: new Map([
            [
              "",
              {
                name: "",
                revision: 8,
                url: "",
                transitions: [],
                is_rnav: false,
                dme_required: true,
                proc: [],
              },
            ],
          ]),
          loa: new Map([
            [
              "zoa",
              [
                {
                  dep_apts: ["sfo", "oak"],
                  dep_flows: [],
                  arr_flows: ["sanw"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..LAX.HUBRD",
                  is_rnav: false,
                  notes: "Direct LAX approved",
                },
                {
                  dep_apts: ["sfo", "oak"],
                  dep_flows: [],
                  arr_flows: ["sanw"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: ["MCKEY..LAX.COMIX", "YYUNG..LAX.COMIX"],
                  is_rnav: true,
                  notes: "Direct LAX approved",
                },
                {
                  dep_apts: ["sfo", "oak"],
                  dep_flows: ["sfoe"],
                  arr_flows: ["sanw"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "CISKO..FLW..LAX.COMIX",
                  is_rnav: true,
                  notes: "Direct LAX approved",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["sanw"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: ["..LAX.COMIX", "..HUULK.COMIX"],
                  is_rnav: true,
                  notes: "",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["sanw"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..LAX.HUBRD",
                  is_rnav: false,
                  notes: "",
                },
                {
                  dep_apts: ["sfo", "oak"],
                  dep_flows: [],
                  arr_flows: ["sane"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: ["MCKEY..LAX.PLYYA", "YYUNG..LAX.PLYYA"],
                  is_rnav: true,
                  notes: "Direct LAX approved",
                },
                {
                  dep_apts: ["sfo", "oak"],
                  dep_flows: ["sfoe"],
                  arr_flows: ["sane"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "CISKO..FLW..LAX.PLYYA",
                  is_rnav: true,
                  notes: "Direct LAX approved",
                },
                {
                  dep_apts: ["sfo", "oak"],
                  dep_flows: [],
                  arr_flows: ["sane"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..LAX.SHAMU",
                  is_rnav: false,
                  notes: "Direct LAX approved",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["sane"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..LAX.PLYYA",
                  is_rnav: true,
                  notes: "",
                },
                {
                  dep_apts: [],
                  dep_flows: [],
                  arr_flows: ["sane"],
                  plane_classifications: [
                    PLANE_CATEGORY.JET,
                    PLANE_CATEGORY.TURBOPROP,
                    PLANE_CATEGORY.PROP,
                  ],
                  route: "..LAX.SHAMU",
                  is_rnav: false,
                  notes: "",
                },
              ],
            ],
          ]),
        },
      },
    },
  ],
]);

export default apt;
export { type apt_info };
