// common errors
export const AdminError = () => new Error("The user is not an admin");
export const ValueEmptyError = (field?: string) =>
  new Error(`${field ?? "Field"} was left empty`);
