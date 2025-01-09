import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@resume-optimizer/ui/state/use-auth-context";
import { useSnackbar } from "notistack";
import Text from "@resume-optimizer/ui/components/Text";

const Login = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const showErrorSnackbar = useCallback(
    () =>
      enqueueSnackbar("Error logging in", {
        variant: "error",
        autoHideDuration: 3000,
      }),
    [enqueueSnackbar]
  );

  const signIn = useCallback(async () => {
    if (!email || !password) {
      showErrorSnackbar();
      return;
    }

    await login(email, password)
      .then(() => {
        navigate("/");
      })
      .catch(() => showErrorSnackbar());
  }, [email, login, navigate, password, showErrorSnackbar]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 justify-center">
      <div className="flex flex-col gap-2 w-[300px]">
        <input
          className="border-[2px] border-primary-light focus:outline-none h-10 rounded-md focus:border-primary-dark px-2"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="border-[2px] border-primary-light focus:outline-none h-10 rounded-md focus:border-primary-dark px-2"
          type="text"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          className="rounded-full bg-secondary-default flex justify-center items-center w-[100px] h-8 hover:bg-secondary-dark"
          onClick={signIn}
        >
          <Text variant="subtitle1" className="text-white">
            Sign in
          </Text>
        </button>
        <Text variant="h6" className="text-primary-dark">
          or
        </Text>
        <Link to="/signup" className="h-fit">
          <Text
            variant="subtitle1"
            className="text-primary-default hover:text-primary-dark"
          >
            create an account
          </Text>
        </Link>
      </div>
    </div>
  );
};

export default Login;
