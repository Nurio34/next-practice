import bcrypt from "bcryptjs";

export const hash = (item: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(item, salt);

  return hash;
};

export const check = (item: string, hash: string) => {
  return bcrypt.compareSync(item, hash);
};
