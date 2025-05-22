import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

const DemoDialog = ({ open, setOpen, handleDemoLogin }: { open: boolean, setOpen: (open: boolean) => void, handleDemoLogin: () => void }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Atenção</AlertDialogTitle>
          <AlertDialogDescription>
            Essa aplicação é um projeto de estudo e aprimoramento pessoal, e <b> não </b>
            está preparada para uso em produção.
            Portanto, <b> não </b> inclua dados sensíveis ou pessoais.
            Você pode <a href="" onClick={(e) => { e.preventDefault(); handleDemoLogin() }} className="text-blue-500 underline">entrar como convidado</a>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDemoDialog, setOpenDemoDialog] = useState(false);
  const login = useAuth();
  const navigate = useNavigate();

  if (login.isAuthenticated) {
    navigate('/dashboard');
  }

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/demo')
      const user = response.data.user;
      login.login(user, response.data.token);

      navigate('/dashboard');

    } catch (err: any) {
      console.error('Login failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password,
      });

      console.log('Login successful:', response.data);

      // --- Authentication State Management ---
      const user = response.data.user;
      login.login(user, response.data.token);

      navigate('/dashboard');

    } catch (err: any) {
      console.error('Login failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <DemoDialog open={openDemoDialog} setOpen={setOpenDemoDialog} handleDemoLogin={handleDemoLogin} />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo</CardTitle>
          <CardDescription>
            Entre com seus dados cadastrais para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500 text-center">
            {error && <span>{error}</span>}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    {
                      // <a
                      // href="/recover"
                      // className="ml-auto text-sm underline-offset-4 hover:underline"
                      // >
                      // Esqueci minha senha
                      // </a>
                    }
                    <Link
                      to="/recover"
                      className="ml-auto text-sm underline-offset-4 underline"
                      onClick={(e) => { e.preventDefault(); setOpenDemoDialog(true) }}
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Não está registrado?{" "}
                {
                  // <a href="/register" className="underline underline-offset-4">
                  // Crie uma conta
                  // </a>
                }
                <Link
                  to="register"
                  className="ml-auto text-sm underline-offset-4 underline"
                  onClick={(e) => { e.preventDefault(); setOpenDemoDialog(true) }}
                >
                  Crie uma conta
                </Link>
                {" "}ou{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-500 hover:underline cursor-pointer"
                  onClick={handleDemoLogin}
                >
                  Teste como convidado
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Essa aplicação é um projeto de estudo e aprimoramento pessoal. O código está disponível no <a href="https://github.com/VitorMouro">repositório do GitHub</a>.
      </div>
    </div>
  )
}
