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
  is_client_state = (user_id: number) => {
    return this.userStates[user_id] === "client";
  };
  is_admin_state = (user_id: number) => {
    return this.userStates[user_id] === "admin";
  };
  is_start_state = (user_id: number) => {
    return this.userStates[user_id] === "initial";
  };
  is_add_consumage_state = (user_id: number) => {
    return this.userStates[user_id] == "add_consumage";
  };
  is_show_loads_state = (user_id: number) => {
    return this.userStates[user_id] == "show_loads";
  };
  is_add_load_state = (user_id: number) => {
    return this.userStates[user_id] == "add_load";
  };
  set_admin_state = (user_id: number) => {
    if (this.is_start_state(user_id)) this.userStates[user_id] = "admin";
  };
  set_client_state = (user_id: number) => {
    if (this.is_start_state(user_id)) this.userStates[user_id] = "client";
  };
  set_initial_state = (user_id: number) => {
    this.userStates[user_id] = "initial";
  };
  set_add_load_state = (user_id: number) => {
    if (this.is_admin_state(user_id)) {
      this.userStates[user_id] = "add_load";
    }
  };
  set_add_consumage_state = (user_id: number) => {
    if (this.is_add_load_state(user_id)) {
      this.userStates[user_id] = "add_consumage";
    }
  };
  set_show_loads_state = (user_id: number) => {
    if (this.is_admin_state(user_id)) {
      this.userStates[user_id] = "show_loads";
    }
  };
}
