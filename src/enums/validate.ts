// Login Rules
const validateName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("The username cannot be empty"));
  } else {
    callback();
  }
};

export const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Password cannot be empty"));
  } else {
    callback();
  }
};

export const SignInRules = {
  username: [{ validator: validateName, trigger: "blur", min: 3 }],
  password: [{ validator: validatePassword, trigger: "blur", min: 3 }],
};

// Registration rules
export const SignUpRules = {
  username: [{ required: true, trigger: "blur", min: 3 }],
  password: [{ required: true, trigger: "blur", min: 3 }],
  sex: [{ required: true, message: "Please select gender", trigger: "change" }],
  phoneNum: [{ essage: "Please select a date", trigger: "blur" }],
  email: [
    { message: "Please enter your email address", trigger: "blur" },
    {
      type: "email",
      message: "Please enter the correct email address",
      trigger: ["blur", "change"],
    },
  ],
  birth: [{ required: true, type: "date", message: "Please select a date", trigger: "change" }],
  introduction: [{ message: "Please enter an introduction", trigger: "blur" }],
  location: [{ message: "Please enter the region", trigger: "change" }],
};
