import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FormField } from "../common/FormField";
import { REGISTER_USER } from "../../graphql/mutations/userMutations";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    password: "",
  });

  const [register, { loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        variables: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contactInfo: formData.phone,
        },
      });
      if (data.register.token) {
        localStorage.setItem("token", data.register.token);
        localStorage.setItem("user", JSON.stringify(data.register.user));
        navigate("/academic-profile");
      }
    } catch (err) {
      console.error("Error registering user", err);
    }
  };

  return (
    <section className="grow shrink self-stretch my-auto min-w-60 w-[482px] max-md:max-w-full">
      <h2 className="text-6xl font-playfair italic font-extrabold text-zinc-800 max-md:text-4xl">
        Sign up
      </h2>
      <p className="mt-5 text-lg font-worksans font-medium text-zinc-800">
        Create an account to continue
      </p>

      {error && <p className="text-red-500 mt-2">{error.message}</p>}

      <form onSubmit={handleSubmit} className="mt-5 max-w-full w-[420px]">
        <FormField
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Birth of date"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
        <FormField
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <FormField
          label="Set Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full py-4 text-lg font-worksans font-medium text-white bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2 disabled:bg-zinc-400"
        >
          {loading ? "Signing up..." : "Continue"}
        </button>
      </form>
    </section>
  );
}