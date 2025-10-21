type State = "initial" | "add_load" | "add_consumage" | "show_loads";
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

  is_added_id = (user_id: number) => {
    return Boolean(this.userStates[user_id]);
  };
  is_add_consumage = (user_id: number) => {
    return this.userStates[user_id] == "add_consumage";
  };
  is_show_loads = (user_id: number) => {
    return this.userStates[user_id] == "show_loads";
  };
  is_initial = (user_id: number) => {
    return this.userStates[user_id] === "initial";
  };
  is_add_load = (user_id: number) => {
    return this.userStates[user_id] == "add_load";
  };
  restart_state = (user_id: number) => {
    if (!(this.userStates[user_id] === "initial"))
      this.userStates[user_id] = "initial";
  };
  add_load = (user_id: number) => {
    if (this.userStates[user_id] === "initial") {
      this.userStates[user_id] = "add_load";
    }
  };
  add_consumage = (user_id: number) => {
    if (this.userStates[user_id] === "add_load") {
      this.userStates[user_id] = "add_consumage";
    }
  };
  show_loads = (user_id: number) => {
    if (this.userStates[user_id] === "initial") {
      this.userStates[user_id] = "show_loads";
    }
  };
}
