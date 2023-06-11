// The legacy FAA Equipment Code: https://en.wikipedia.org/wiki/Equipment_codes#List_of_FAA_aircraft_equipment_codes_for_US_domestic_flights[4]
export enum PLANE_EQUIPMENT {
  A = "a",
  L = "l",
  G = "g",
  I = "i",
  U = "u",
  W = "w",
  Z = "z",
}

export enum PLANE_CATEGORY {
  JET = "j",
  TURBOPROP = "t",
  PROP = "p",
  ALL = "",
}

export enum FLIGHT_PLAN {
  IFR = "ifr",
  VFR = "vfr",
}
