import * as v from 'valibot';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { useForgotPassword } from '../../hooks/useAuthMutations.ts';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthCard from '../../components/layouts/AuthCard';
import { isAxiosError } from 'axios';

const ForgotPasswordSchema = v.object({
  mail: v.pipe(v.string(), v.email('Debe ser un email válido.')),
});

type ForgotPasswordFormData = v.InferInput<typeof ForgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: valibotResolver(ForgotPasswordSchema),
  });

  const { mutate: sendLink, isPending, isSuccess, error } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendLink(data.mail);
  };

  return (
    <AuthCard
      title="Recuperar Contraseña"
      description={
        isSuccess
          ? 'Revisa tu bandeja de entrada'
          : 'Ingresa tu correo para recibir un enlace de recuperación'
      }
    >
      {isSuccess ? (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-800">
            Solicitud procesada
          </h3>
          <p className="text-slate-600">
            Si una cuenta con el correo{' '}
            <span className="font-semibold">{getValues('mail')}</span> existe,
            hemos enviado un enlace de recuperación.
          </p>
          <p className="text-sm text-slate-500">
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="mail"
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            icon={<Mail className="h-5 w-5" />}
            autoComplete="email"
            {...register('mail')}
            error={errors.mail?.message}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {isAxiosError(error)
                ? error.response?.data?.message
                : 'No se pudo procesar la solicitud.'}
            </p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isPending}
              variant="primary"
              size="lg"
              fullWidth
            >
              Enviar Enlace
            </Button>
          </div>

          <div className="text-center text-sm text-slate-600">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Recordé mi contraseña
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
