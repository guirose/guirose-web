export const EMPRESA = {
  razonSocial: "Representaciones GUIROSE EIRL",
  ruc: "20606160811", // POR CONFIRMAR: copiar de la Consulta RUC de SUNAT (11 dígitos)
  domicilio: "Av. Víctor Castro Iglesias 552, San Juan de Miraflores 15801",
  correo: "admi.guirosemotor@gmail.com", // provisional hasta tener el correo del dominio
};

export type IconoEsencial = "cotiza" | "pago" | "escudo" | "lista" | "mano" | "reloj" | "persona";

export type Bloque =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "tabla"; encabezados: string[]; filas: string[][] };

export type Punto = { titulo: string; bloques: Bloque[] };
export type Parte = { letra: string; titulo: string; puntos: Punto[] };
export type Esencial = { icono: IconoEsencial; titulo: string; texto: string };

export type DocumentoLegal = {
  ruta: "/terminos" | "/privacidad";
  titulo: string;
  bajada: string;
  vigente: string;
  version: string;
  preliminar: boolean;
  intro: string;
  esencial: Esencial[];
  partes: Parte[];
};

const identidad = `**${EMPRESA.razonSocial}**, con RUC ${EMPRESA.ruc} y domicilio en ${EMPRESA.domicilio}`;

export const TERMINOS: DocumentoLegal = {
  ruta: "/terminos",
  titulo: "Términos y condiciones",
  bajada: "Cómo funciona la cotización y qué condiciones aplican al comprar tu motor Mercury con GUIROSE.",
  vigente: "19 de noviembre de 2026", // cambiar al día en que se publique
  version: "0.9",
  preliminar: true,
  intro:
    "Estos términos explican qué significa pedir una cotización en este sitio y qué condiciones aplican cuando compras un motor Mercury con nosotros. No reemplazan los derechos que te da el Código de Protección y Defensa del Consumidor (Ley 29571): si algo de aquí te diera menos, se aplica la ley.",
  esencial: [
    { icono: "cotiza", titulo: "Cotizar es gratis y no te obliga", texto: "Antes de que pagues, el asesor te confirma por escrito el precio, el stock y la entrega." },
    { icono: "pago", titulo: "Paga solo a cuentas de GUIROSE", texto: "Nunca a la cuenta personal de un trabajador ni de otra persona." },
    { icono: "escudo", titulo: "Garantía Mercury y garantía legal", texto: "GUIROSE responde por el motor que te vende." },
  ],
  partes: [
    {
      letra: "A",
      titulo: "El sitio y tus cotizaciones",
      puntos: [
        {
          titulo: "Quiénes somos",
          bloques: [
            { tipo: "parrafo", texto: `Este sitio pertenece a ${identidad}. Puedes escribirnos a ${EMPRESA.correo}. Comercializamos motores fuera de borda Mercury.` },
            { tipo: "parrafo", texto: "Estos términos se aplican al uso del sitio, a las cotizaciones y a las compras que hagas con GUIROSE. A cada compra se le aplica la versión vigente el día en que compras." },
          ],
        },
        {
          titulo: "Qué es una cotización",
          bloques: [
            {
              tipo: "lista",
              items: [
                "Pedir una cotización es gratis y no te obliga a comprar.",
                "La cotización no es una venta ni una reserva. Antes de que pagues, el asesor te confirma por escrito el precio total con IGV, el stock, el plazo de entrega y el costo de envío.",
                "Lo que el sitio muestra como incluido con cada modelo es parte de nuestra oferta. Si algo cambia, por ejemplo por stock, el asesor te lo dirá antes de que pagues.",
              ],
            },
          ],
        },
        {
          titulo: "Fotos y fichas técnicas",
          bloques: [
            { tipo: "parrafo", texto: "Las fotos son referenciales. Los datos técnicos vienen de las fichas de Mercury Marine y el fabricante puede actualizarlos. Antes de pagar, el asesor te confirma por escrito el modelo exacto y su equipamiento." },
          ],
        },
        {
          titulo: "Uso correcto del cotizador",
          bloques: [
            { tipo: "parrafo", texto: "Usa datos verdaderos: los tuyos o los de la persona o empresa que representas. El cotizador es para mayores de 18 años. Podemos no atender solicitudes con datos falsos o enviadas de forma automática." },
            { tipo: "parrafo", texto: "Lo que hacemos con tus datos está en la [Política de privacidad](/privacidad)." },
          ],
        },
        {
          titulo: "Marcas y contenidos",
          bloques: [
            { tipo: "parrafo", texto: "Mercury, SeaPro y sus logotipos son marcas de sus titulares y aparecen aquí porque GUIROSE comercializa sus productos. Los textos, fotos y diseño del sitio son de GUIROSE o se usan con permiso." },
            { tipo: "parrafo", texto: "Los videos de la Comunidad GUIROSE se reproducen desde TikTok; al verlos también aplican las condiciones de TikTok." },
          ],
        },
      ],
    },
    {
      letra: "B",
      titulo: "Compras y pagos",
      puntos: [
        {
          titulo: "Medios de pago",
          bloques: [
            { tipo: "parrafo", texto: `Paga por los medios que establece la ley y solo en cuentas a nombre de ${EMPRESA.razonSocial}, que el asesor te indicará por escrito.` },
            { tipo: "parrafo", texto: "Ningún trabajador de GUIROSE te pedirá depositar en una cuenta personal o de otra persona. Si alguien lo hace, no pagues y avísanos." },
          ],
        },
        {
          titulo: "Pagos a cuentas que no son de GUIROSE",
          bloques: [
            { tipo: "parrafo", texto: "Un depósito o una transferencia a una cuenta que no es de GUIROSE no se registra como pago de tu compra hasta que verifiquemos que el dinero ingresó a nuestras cuentas. Si te pasó, avísanos de inmediato: revisaremos el caso contigo." },
          ],
        },
        {
          titulo: "Plazos de entrega y envíos",
          bloques: [
            { tipo: "parrafo", texto: "El plazo de entrega se cuenta desde que GUIROSE confirma tu pago y es el que el asesor te indica por escrito antes de que pagues. Hacemos envíos a todo el Perú; el costo, el plazo y la forma de envío se te informan antes de pagar." },
          ],
        },
        {
          titulo: "Comprobante de pago",
          bloques: [{ tipo: "parrafo", texto: "Con cada compra recibes una boleta o una factura. Guárdala: te ayudará a pedir la garantía." }],
        },
      ],
    },
    {
      letra: "C",
      titulo: "Garantía y productos con defecto",
      puntos: [
        {
          titulo: "Quién responde",
          bloques: [
            { tipo: "parrafo", texto: "GUIROSE responde ante ti por la calidad y el buen funcionamiento del motor que te vende, y tramita la garantía de Mercury Marine según sus condiciones oficiales para el Perú." },
            { tipo: "parrafo", texto: "La garantía de Mercury se suma a tus derechos: la garantía legal e implícita del Código de Protección y Defensa del Consumidor (artículo 20) se aplica siempre. Los plazos de la garantía de Mercury según el tipo de motor y el uso están en la página de [Garantía](/garantia)." },
          ],
        },
        {
          titulo: "Cómo pedir la garantía",
          bloques: [
            { tipo: "parrafo", texto: "Escríbenos con el comprobante de compra, el número de serie del motor, la fecha de compra, el tipo de uso y, si los tienes, el registro de horas y la información de los mantenimientos. Si te falta algún documento, igual recibimos tu solicitud." },
            { tipo: "parrafo", texto: "Si hace falta una revisión técnica, se hace según el procedimiento de Mercury Marine. Te entregaremos por escrito el resultado del diagnóstico y, si la garantía no cubre la falla, el motivo." },
          ],
        },
        {
          titulo: "Mantenimiento, instalación y modificaciones",
          bloques: [
            { tipo: "parrafo", texto: "Para conservar la garantía de Mercury, cumple el programa de mantenimiento del fabricante, usa repuestos y lubricantes que cumplan sus especificaciones e instala el motor según sus indicaciones." },
            { tipo: "parrafo", texto: "Solo puede quedar fuera de la garantía una falla que se demuestre causada por no haberlo hecho, por un mal uso o por una modificación no autorizada. Las demás fallas siguen cubiertas." },
          ],
        },
        {
          titulo: "Productos con defecto",
          bloques: [
            { tipo: "parrafo", texto: "Si el producto tiene un defecto de fábrica o no funciona como debe, tienes derecho a su reparación, a su reposición por otro igual o a la devolución de lo pagado, en los casos que señala el artículo 97 del Código de Protección y Defensa del Consumidor. GUIROSE coordina contigo la solución; si corresponde devolverte el dinero, lo hacemos por el mismo medio de pago o por otro que acordemos contigo." },
          ],
        },
      ],
    },
    {
      letra: "D",
      titulo: "Reclamos y normas",
      puntos: [
        {
          titulo: "Reclamos y quejas",
          bloques: [
            { tipo: "parrafo", texto: `Si no estás conforme con un producto o con nuestra atención, escríbenos a ${EMPRESA.correo}. Te responderemos en un plazo máximo de 15 días hábiles. Esto no te impide acudir a Indecopi.` },
          ],
        },
        {
          titulo: "Normas que se aplican",
          bloques: [
            { tipo: "parrafo", texto: "Estos términos se rigen por las leyes del Perú, en especial el Código de Protección y Defensa del Consumidor. La garantía de Mercury se rige además por sus condiciones oficiales para el Perú. Si algo de estos términos contradice la ley, se aplica la ley." },
          ],
        },
        {
          titulo: "Cambios a estos términos",
          bloques: [
            { tipo: "parrafo", texto: "Si actualizamos estos términos, publicaremos aquí la nueva versión con su fecha antes de que rija. Los cambios no se aplican a cotizaciones aceptadas ni a compras ya confirmadas." },
          ],
        },
      ],
    },
  ],
};

export const PRIVACIDAD: DocumentoLegal = {
  ruta: "/privacidad",
  titulo: "Política de privacidad",
  bajada: "Qué datos pedimos, para qué los usamos, con quién los compartimos y cómo puedes verlos, corregirlos o borrarlos.",
  vigente: "19 de noviembre de 2026", // cambiar al día en que se publique
  version: "0.9",
  preliminar: true,
  intro:
    "En GUIROSE usamos tus datos para atender tu cotización y, si compras, para la venta, la entrega y la garantía. Esta política cumple la Ley 29733 de Protección de Datos Personales y su reglamento (Decreto Supremo 016-2024-JUS).",
  esencial: [
    { icono: "lista", titulo: "Pedimos lo necesario para cotizar", texto: "Nombre, celular y documento. El correo y el comentario son opcionales." },
    { icono: "mano", titulo: "No vendemos tus datos", texto: "Y no te enviamos publicidad sin tu permiso." },
    { icono: "reloj", titulo: "Los guardamos solo lo necesario", texto: "Cuando ya no hacen falta, los borramos." },
    { icono: "persona", titulo: "Tú decides", texto: "Puedes pedir verlos, corregirlos o borrarlos cuando quieras, gratis." },
  ],
  partes: [
    {
      letra: "A",
      titulo: "Quiénes somos y qué datos tratamos",
      puntos: [
        {
          titulo: "Responsable de tus datos",
          bloques: [
            { tipo: "parrafo", texto: `${identidad}, es la responsable de tus datos. Para cualquier tema de privacidad escríbenos a ${EMPRESA.correo}.` },
          ],
        },
        {
          titulo: "Qué datos pedimos en el cotizador",
          bloques: [
            {
              tipo: "tabla",
              encabezados: ["Dato", "¿Es obligatorio?", "Para qué lo usamos"],
              filas: [
                ["Nombre completo", "Sí", "Para dirigirnos a ti y preparar la cotización."],
                ["Celular", "Sí", "Para contactarte por WhatsApp o llamada sobre tu cotización."],
                ["Tipo y número de documento (DNI, RUC o carné de extranjería)", "Sí", "Para identificarte en la cotización y, si compras, emitir tu boleta o factura."],
                ["Correo electrónico", "No", "Para escribirte por correo, si lo prefieres."],
                ["Comentario", "No", "Para entender mejor lo que necesitas."],
                ["Motor y equipamiento que elegiste", "Se guarda con tu solicitud", "Para preparar la cotización."],
              ],
            },
            { tipo: "parrafo", texto: "Recibimos estos datos directamente de ti. Si cotizas por una empresa o por otra persona, asegúrate de que sepa que nos das sus datos. No escribas en el comentario datos que no hagan falta, como datos de salud." },
          ],
        },
        {
          titulo: "Datos que se registran al usar el sitio",
          bloques: [
            { tipo: "parrafo", texto: "Como en cualquier sitio web, los servidores que lo alojan registran datos técnicos, como la dirección IP, el navegador y la fecha de visita, para mantener el sitio funcionando y protegerlo de abusos." },
            { tipo: "parrafo", texto: "El sitio guarda en tu navegador el motor y el equipamiento que vas eligiendo, para que no pierdas tu selección; esa información queda en tu equipo y se borra al enviar la cotización. No usamos cookies de publicidad ni de analítica." },
          ],
        },
      ],
    },
    {
      letra: "B",
      titulo: "Para qué usamos tus datos",
      puntos: [
        {
          titulo: "Para atenderte",
          bloques: [
            {
              tipo: "lista",
              items: [
                "Responder tu solicitud de cotización y contactarte por WhatsApp, llamada o correo sobre ella.",
                "Registrar tu solicitud en nuestro sistema de atención de clientes, para que un asesor le dé seguimiento.",
                "Si compras: gestionar la venta, el pago, la entrega, el comprobante, la garantía y los reclamos.",
                "Proteger el sitio del envío automático o abusivo de formularios.",
                "Cumplir obligaciones legales, como las tributarias.",
              ],
            },
            { tipo: "parrafo", texto: "Estos usos son necesarios para preparar y cumplir la relación que nos pides (artículo 14 de la Ley 29733); sin estos datos no podemos atender tu cotización. No tomamos decisiones automatizadas sobre ti: un asesor revisa cada cotización." },
          ],
        },
        {
          titulo: "Publicidad",
          bloques: [
            { tipo: "parrafo", texto: "No te enviamos ofertas ni publicidad. Si algún día lo ofrecemos, será solo con una casilla aparte y opcional, y podrás retirar ese permiso cuando quieras. Los mensajes del asesor sobre la cotización que pediste no son publicidad." },
          ],
        },
      ],
    },
    {
      letra: "C",
      titulo: "Con quién compartimos tus datos",
      puntos: [
        {
          titulo: "Empresas que trabajan por encargo nuestro",
          bloques: [
            {
              tipo: "tabla",
              encabezados: ["Empresa", "Qué hace por nosotros"],
              filas: [
                ["Supabase", "Base de datos donde se guardan las cotizaciones (servidores en Brasil)."],
                ["Kommo", "Sistema de atención de clientes que usan nuestros asesores."],
                ["Meta (WhatsApp Business)", "Mensajes de WhatsApp de la empresa, a través de Kommo."],
                ["GitHub (GitHub Pages)", "Publica el sitio web."],
              ],
            },
            { tipo: "parrafo", texto: "Tratan tus datos solo por encargo de GUIROSE y para los fines de esta política. Algunos de estos servicios guardan los datos fuera del Perú (flujo transfronterizo). No vendemos ni alquilamos tus datos." },
          ],
        },
        {
          titulo: "Otros destinatarios",
          bloques: [
            { tipo: "parrafo", texto: "Si pides una garantía, enviamos a Mercury Marine y a su canal de distribución en el Perú los datos necesarios para tramitarla: tu nombre, el número de serie del motor, la fecha de compra, el uso declarado y los detalles del caso. También entregamos datos a las autoridades cuando la ley lo exige." },
          ],
        },
        {
          titulo: "Servicios de otras empresas que usas tú",
          bloques: [
            { tipo: "parrafo", texto: "Cuando nos escribes desde tu WhatsApp o ves un video, usas servicios de Meta o de TikTok, que tratan tus datos según sus propias políticas. El reproductor de TikTok se carga solo cuando tocas «Reproducir»." },
          ],
        },
      ],
    },
    {
      letra: "D",
      titulo: "Cuánto tiempo y cómo los protegemos",
      puntos: [
        {
          titulo: "Cuánto tiempo guardamos tus datos",
          bloques: [
            { tipo: "parrafo", texto: "Guardamos tus datos solo mientras hacen falta para atender tu cotización, la relación comercial y la garantía, y el tiempo que exigen las normas tributarias y contables. Después los borramos o los anonimizamos." },
          ],
        },
        {
          titulo: "Cómo los protegemos",
          bloques: [
            { tipo: "parrafo", texto: "El sitio funciona con conexión cifrada (HTTPS). El formulario solo puede guardar cotizaciones nuevas: no puede leer las de otras personas. Solo el personal autorizado de GUIROSE accede a tus datos, con su propio usuario, y las claves de nuestros servicios nunca llegan a tu navegador. Si ocurriera un incidente de seguridad que pueda afectarte, te avisaremos y lo comunicaremos a la autoridad." },
          ],
        },
      ],
    },
    {
      letra: "E",
      titulo: "Tus derechos",
      puntos: [
        {
          titulo: "Qué derechos tienes",
          bloques: [
            {
              tipo: "lista",
              items: [
                "**Información:** saber cómo usamos tus datos.",
                "**Acceso:** pedir una copia de tus datos.",
                "**Rectificación:** corregir datos inexactos o incompletos.",
                "**Cancelación:** pedir que los borremos.",
                "**Oposición:** pedir que dejemos de usarlos para un fin.",
                "**Portabilidad:** recibirlos en un formato que puedas llevar a otra empresa.",
              ],
            },
          ],
        },
        {
          titulo: "Cómo ejercerlos",
          bloques: [
            { tipo: "parrafo", texto: `Escríbenos a ${EMPRESA.correo} con el asunto «Datos personales». Indica tu nombre, el derecho que quieres ejercer y el medio por el que quieres la respuesta, y adjunta tu documento de identidad (o el poder, si actúas por otra persona). Es gratis y te responderemos dentro de los plazos de ley.` },
            { tipo: "parrafo", texto: "Si no te respondemos o no estás conforme, puedes pedir la tutela de tus derechos ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos." },
          ],
        },
      ],
    },
    {
      letra: "F",
      titulo: "Videos, menores y cambios",
      puntos: [
        {
          titulo: "Videos de clientes y TikTok",
          bloques: [
            { tipo: "parrafo", texto: "Los clientes que aparecen en nuestros videos autorizaron su publicación. Si apareces en un video y quieres que lo retiremos del sitio, escríbenos y lo quitaremos." },
            { tipo: "parrafo", texto: "Para mostrar los videos, el sitio consulta en TikTok solo la información de los videos de nuestra cuenta @guirose_pe: título, portada, duración y enlace. No obtenemos datos de las cuentas de TikTok de los visitantes. Si desconectamos nuestra cuenta, borramos lo que guardamos de TikTok." },
          ],
        },
        {
          titulo: "Menores de edad",
          bloques: [{ tipo: "parrafo", texto: "El cotizador está dirigido a mayores de 18 años. Si eres menor, pide a tu madre, padre o tutor que haga la cotización." }],
        },
        {
          titulo: "Cambios a esta política",
          bloques: [
            { tipo: "parrafo", texto: "Si cambiamos esta política, publicaremos la nueva versión aquí con su fecha. Si el cambio amplía el uso de tus datos, te pediremos tu consentimiento cuando la ley lo exija." },
          ],
        },
      ],
    },
  ],
};