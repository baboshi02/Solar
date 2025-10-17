export type states =
  | "initial"
  | "add_load"
  | "add_consumage"
  | "show_loads"
  | "start";
export interface UserStates {
  [key: number]: states;
}
