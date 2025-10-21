type State =
  | "initial"
  | "add_load"
  | "add_consumage"
  | "show_loads"
  | "admin"
  | "client"
  | "start";
interface StateDict {
  [key: number]: State;
}
export class UserStates {
  private userStates: StateDict = {} as StateDict;
  add_id = (user_id: number) => {
    if (!this.is_added_id(user_id)) {
      this.userStates[user_id] = "initial";
    }
  };

  state_type = (user_id: number) => {
    return this.userStates[user_id];
  };
  is_added_id = (user_id: number) => {
    return Boolean(this.userStates[user_id]);
  };
  set_state = (user_id: number, state: State) => {
    this.userStates[user_id] = state;
  };
}
