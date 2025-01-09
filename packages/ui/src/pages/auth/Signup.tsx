import Text from "@resume-optimizer/ui/components/Text";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRegisterUserMutation } from "@resume-optimizer/ui/graphql/users/users";
import { RegistrationInput } from "@resume-optimizer/ui/graphql/graphql";
import { enqueueSnackbar } from "notistack";
import { LoadingDots } from "@resume-optimizer/ui/components/LoadingDots";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";

const Signup = () => {
  const [registrationInput, setRegistrationInput] = useState<RegistrationInput>(
    { email: "", password: "", firstName: "", lastName: "" }
  );
  const [registerUserMutation, { loading, error }] = useRegisterUserMutation({
    variables: {
      registrationInput,
    },
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const showErrorSnackbar = () =>
    enqueueSnackbar("Error logging in", {
      variant: "error",
      autoHideDuration: 3000,
    });
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const passwordValid = useMemo(
    () =>
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(
        registrationInput.password
      ),
    [registrationInput]
  );
  const inputValid = useMemo(() => {
    if (Object.values(registrationInput).some((val) => val === ""))
      return false;
    return passwordValid;
  }, [registrationInput, passwordValid]);

  const signUp = useCallback(() => {
    if (!inputValid) {
      showErrorSnackbar();
      return;
    }
    registerUserMutation()
      .then(
        async () =>
          await login(registrationInput.email, registrationInput.password).then(
            () => setLoginLoading(false)
          )
      )
      .then(() => navigate("/"))
      .catch(() => showErrorSnackbar());
  }, [inputValid, registerUserMutation, login, registrationInput, navigate]);

  useEffect(() => {
    if (error) showErrorSnackbar();
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 justify-center">
      <div className="flex flex-col gap-2 w-[300px] max-w-full">
        <input
          className="border-[2px] border-primary-light focus:outline-none h-10 rounded-md focus:border-primary-dark px-2"
          type="text"
          onChange={(e) =>
            setRegistrationInput((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email"
        />
        <input
          className="border-[2px] border-primary-light focus:outline-none h-10 rounded-md focus:border-primary-dark px-2"
          type="text"
          onChange={(e) =>
            setRegistrationInput((prev) => ({
              ...prev,
              firstName: e.target.value,
            }))
          }
          placeholder="First name"
        />
        <input
          className="border-[2px] border-primary-light focus:outline-none h-10 rounded-md focus:border-primary-dark px-2"
          type="text"
          onChange={(e) =>
            setRegistrationInput((prev) => ({
              ...prev,
              lastName: e.target.value,
            }))
          }
          placeholder="Last name"
        />
        <div className="flex flex-col">
          <input
            className={classNames(
              "border-[2px] focus:outline-none h-10 rounded-md px-2",
              {
                "border-error":
                  !passwordValid && registrationInput.password !== "",
                "border-primary-light focus:border-primary-dark": !(
                  !passwordValid && registrationInput.password !== ""
                ),
              }
            )}
            type="password"
            onChange={(e) =>
              setRegistrationInput((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="Password"
          />
          {!passwordValid && registrationInput.password !== "" && (
            <Text className="text-error text-xs">
              8+ characters with a mix of letters and numbers.
            </Text>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          className={classNames(
            "rounded-full flex justify-center items-center w-[100px] h-8 ",
            {
              "bg-secondary-default hover:bg-secondary-dark": !(
                loading ||
                loginLoading ||
                !inputValid
              ),
              "bg-gray-500": loading || loginLoading || !inputValid,
            }
          )}
          onClick={signUp}
          disabled={loading || loginLoading || !inputValid}
        >
          {loading ? (
            <LoadingDots />
          ) : (
            <Text variant="subtitle1" className="text-white">
              Sign up
            </Text>
          )}
        </button>
      </div>
    </div>
  );
};
export default Signup;
