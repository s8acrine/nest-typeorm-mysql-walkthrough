export type CreateUserParams = {
  username: string;
  password: string;
}

export type UpdateUserParams = {
  username: string;
  password: string;
}

export type CreateProfileParams = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export type UpdateProfileParams = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export type CreatePostParams = {
  title: string;
  body: string;
}

export type UpdatePostParams = {
  title: string;
  body: string;
}
