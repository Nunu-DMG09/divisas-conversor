const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');


const convertirDivisa = async (monto, monedaDestino) => {
  try {
    const url = `https://api.exchangerate.host/latest?base=USD&symbols=${monedaDestino}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) throw new Error("Problema con la API");

    const datos = await respuesta.json();
    const tasa = datos.rates[monedaDestino];

    // Calcular y mostrar el resultado redondeado

    const total = Math.round(monto * tasa * 100) / 100;

    resultado.textContent = `${monto} USD = ${total} ${monedaDestino}`;
  } catch (error) {
    resultado.textContent = 'Error: No se pudo obtener la conversión.';
    console.error(error);
  }
};


formulario.addEventListener('submit', e => {
  e.preventDefault();

  const monto = parseFloat(document.getElementById('monto').value);
  const monedaDestino = document.getElementById('monedaDestino').value;

  // Validación rápida con ternario
  monto && monedaDestino
    ? convertirDivisa(monto, monedaDestino)
    : resultado.textContent = 'Ingrese un monto válido.';
});
