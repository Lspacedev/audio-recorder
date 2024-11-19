const validateInput = (type, value) => {
  if (value.trim() === "") {
    return {
      valid: false,
      error: "Input is required",
    };
  }
  if (type === "email") {
    return /\S+\@S+\.\S+/.test(value)
      ? {
          valid: true,
          error: null,
        }
      : {
          valid: false,
          error: "Please insert a valid email",
        };
  }
  if (type === "string") {
    return /([A-Za-z])+/.test(value)
      ? {
          valid: true,
          error: null,
        }
      : {
          valid: false,
          error: "Only alphabets allowed ",
        };
  }
  if (type === "number") {
    return /^\d+$/g.test(value)
      ? {
          valid: true,
          error: null,
        }
      : {
          valid: false,
          error: "Only numbers allowed on this field",
        };
  }
  if (type === "password") {
    if (
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[~!#$%^&*(){}\[\]])(?=.*[\d]).{8,}$/.test(
        value
      )
    ) {
      return {
        valid: true,
        error: null,
      };
    }
    const lengthErr = "Password should be at least 8 characters long";
    const uppercaseErr =
      "Password should contain at least one uppercase letter";
    const lowercaseErr =
      "Password should contain at least one lowercase letter";
    const specialCharErr =
      "Password should contain at least one special character";
    const digitErr = "Password should contain at least one digit";

    let errors = [];
    if (!/([A-Z])/.test(value)) {
      errors.push(uppercaseErr);
    }
    if (!/([a-z])/.test(value)) {
      errors.push(lowercaseErr);
    }
    if (!/([~!#$%^&*(){}\[\]])/.test(value)) {
      errors.push(specialCharErr);
    }
    if (!/.{8,}/.test(value)) {
      errors.push(lengthErr);
    }
    if (!/\d/.test(value)) {
      errors.push(digitErr);
    }
    return { valid: false, errors };
  }
};

export { validateInput };
