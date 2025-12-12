import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import { useContact } from '../hooks/useContact';
import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';

interface ApiErrorData {
  message?: string;
  errors?: string | Record<string, unknown>;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [ticketId, setTicketId] = useState<string | null>(null);

  const contactMutation = useContact();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await contactMutation.mutateAsync(formData);
      setTicketId(response.ticketId);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success('Gracias por contactarnos. Te responderemos pronto.');
    } catch (error) {
      // Error is handled by mutation error state
      toast.error('Error al enviar el mensaje');
      console.error('Error sending contact message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 text-center">
          Contáctanos
        </h1>
        <p className="text-slate-600 text-center mb-12">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              {ticketId ? (
                <div className="rounded-lg bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 border border-green-200 p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Mensaje Enviado Exitosamente
                  </h3>
                  <div className="bg-white/70 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-600 mb-1">
                      Número de Ticket
                    </p>
                    <p className="text-lg font-mono font-bold text-blue-600">
                      {ticketId}
                    </p>
                  </div>
                  <Button
                    onClick={() => setTicketId(null)}
                    variant="outline"
                    className="mx-auto"
                  >
                    Enviar Otro Mensaje
                  </Button>
                </div>
              ) : (
                <>
                  {contactMutation.isError && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-800 mb-1">
                          Error al Enviar el Mensaje
                        </h4>
                        <p className="text-sm text-red-700">
                          {(isAxiosError(contactMutation.error) && (contactMutation.error.response?.data as ApiErrorData)?.message) ||
                            'Ocurrió un error al enviar tu mensaje. Por favor, intenta nuevamente.'}
                        </p>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={contactMutation.isPending}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={contactMutation.isPending}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Asunto
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={contactMutation.isPending}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Mensaje
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        disabled={contactMutation.isPending}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <p className="text-slate-600">contacto@plataforma.com</p>
                    <p className="text-slate-600">soporte@plataforma.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      Teléfono
                    </h3>
                    <p className="text-slate-600">+54 11 1234-5678</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Lunes a Viernes: 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      Ubicación
                    </h3>
                    <p className="text-slate-600">Buenos Aires, Argentina</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Horario de Atención
                </h3>
                <div className="space-y-1 text-sm text-purple-800">
                  <p>Lunes - Viernes: 9:00 - 18:00</p>
                  <p>Sábados: 10:00 - 14:00</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
