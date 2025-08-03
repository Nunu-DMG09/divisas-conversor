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
const resultado = document.getElementById("resultado");
const historial = document.getElementById("historial");


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

// funcion para convertir usando fetch async y await
const convertirDivisa = async () => {
  const monto = parseFloat(document.getElementById("monto").value);
  const de = selectDe.value;
  const a = selectA.value;

  if (isNaN(monto) || monto <= 0) {
    resultado.textContent = "Ingresa un monto válido.";
    return;
  }

  try {
    const url = `https://api.exchangerate.host/convert?from=${de}&to=${a}&amount=${monto}`;
    const res = await fetch(url);
    if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
    }


    const data = await res.json();

    console.log(data); // Esto para ver la respuesta de la api

    if (!data.result) throw new Error("Resultado inválido");

    const banderaDe = monedas.find((m) => m.code === de).flag;
    const banderaA = monedas.find((m) => m.code === a).flag;

    resultado.innerHTML = `
      ${banderaDe} ${monto} ${de} = 
      <strong>${banderaA} ${data.result.toFixed(2)} ${a}</strong>
    `;

    //agregar al historial
    const entradaHistorial = document.createElement("div");
    entradaHistorial.textContent = `${new Date().toLocaleTimeString()} - ${banderaDe} ${monto} ${de} ➡️ ${banderaA} ${data.result.toFixed(2)} ${a}`;
    historial.prepend(entradaHistorial);
  } catch (error) {
    console.error("Error en conversión:", error);
    resultado.textContent = "Error al convertir. Intenta nuevamente.";
  }
};

btnConvertir.addEventListener("click", convertirDivisa);
