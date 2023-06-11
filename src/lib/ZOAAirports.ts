import { PLANE_CATEGORY } from "../types";

type apt_info = {
  date?: Date;
  flows: string[];
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
      proc?: {
        plane_classifications: PLANE_CATEGORY[];
        departure_freq: string;
        climb_via_sid: boolean;
        flows: string[];
        rwy: string[];
        altitude: string;
        notes: string;
      }[];
    }[];
  };
};

const apt = new Map<String, apt_info>([
  [
    "oak",
    {
      // The date When the sop was last updated
      date: new Date(2023, 1, 24), // Note that month is 0-based so 0 is January
      flows: ["sfow", "oake", "sfoe"],
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
                rwy: [],
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
                rwy: [],
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
                climb_via_sid: false,
                flows: ["sfow"],
                rwy: [],
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
                rwy: [],
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
                rwy: [],
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
                rwy: [],
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
                rwy: ["30"],
                notes: "Noise Abatement - Northbound",
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
                rwy: [],
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
                rwy: [],
                notes: "Noise Abatement - Southbound",
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
                rwy: [],
                notes: "Noise Abatement - Northbound, Prop Cat A,B Only",
              },
            ],
          },
        ],
      },
    },
  ],

  ["sfo", { flows: ["sfow", "sfoe"] }],
  ["sjc", { flows: ["sfow", "sfoe", "sjce"] }],
]);

export default apt;
export { type apt_info };
