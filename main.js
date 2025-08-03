const monedas = [
  { code: "USD", nombre: "Dólar estadounidense", flag: "🇺🇸" },
  { code: "EUR", nombre: "Euro", flag: "🇪🇺" },
  { code: "PEN", nombre: "Sol peruano", flag: "🇵🇪" },
  { code: "MXN", nombre: "Peso mexicano", flag: "🇲🇽" },
  { code: "JPY", nombre: "Yen japonés", flag: "🇯🇵" },
  { code: "BRL", nombre: "Real brasileño", flag: "🇧🇷" },
];

const selectDe = document.getElementById("de");
const selectA = document.getElementById("a");
const btnConvertir = document.getElementById("convertir");
const btnExportar = document.getElementById("exportar");
const resultado = document.getElementById("resultado");
const historial = document.getElementById("historial");
const inputMonto = document.getElementById("monto");

// cargar las opciones de monedas
monedas.forEach((moneda) => {
  const option1 = document.createElement("option");
  const option2 = document.createElement("option");
  option1.value = option2.value = moneda.code;
  option1.textContent = `${moneda.flag} ${moneda.code}`;
  option2.textContent = `${moneda.flag} ${moneda.code}`;
  selectDe.appendChild(option1);
  selectA.appendChild(option2);
});

selectDe.value = "USD";
selectA.value = "PEN";

// funcion para la api
const convertirDivisa = async () => {
  const monto = parseFloat(inputMonto.value);
  const de = selectDe.value;
  const a = selectA.value;

  if (isNaN(monto) || monto <= 0) {
    resultado.textContent = "Ingresa un monto válido.";
    return;
  }

  resultado.innerHTML = "⌛ Calculando...";

  try {
    const url = `https://api.exchangerate-api.com/v4/latest/${de}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();

    const tasa = data.rates[a];
    if (!tasa) throw new Error("Moneda destino no soportada");

    const total = (monto * tasa).toFixed(2);
    const banderaDe = monedas.find((m) => m.code === de)?.flag || "";
    const banderaA = monedas.find((m) => m.code === a)?.flag || "";

    resultado.innerHTML = `
      ${banderaDe} ${monto} ${de} = 
      <strong>${banderaA} ${total} ${a}</strong>
    `;

    const entradaHistorial = document.createElement("div");
    entradaHistorial.textContent = `${new Date().toLocaleTimeString()} - ${banderaDe} ${monto} ${de} ➡️ ${banderaA} ${total} ${a}`;
    historial.prepend(entradaHistorial);
  } catch (error) {
    console.error("Error en conversión:", error.message);
    resultado.textContent = "Error al convertir. Intenta nuevamente.";
  }
};

btnConvertir.addEventListener("click", convertirDivisa);


// exportar el historial 
btnExportar.addEventListener("click", () => {
  const historialItems = historial.querySelectorAll("div");
  if (historialItems.length === 0) {
    alert("No hay historial para exportar.");
    return;
  }

  let contenido = "Historial de conversiones:\n\n";
  historialItems.forEach((item, index) => {
    contenido += `${index + 1}. ${item.textContent}\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "historial_conversiones.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});
