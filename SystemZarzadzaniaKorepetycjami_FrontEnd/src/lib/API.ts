async function getALL() {
  const response = await fetch('/all');
  return response.json();
}

async function getOne() {
  const response = await fetch('/all');
  return response.json();
}

export { getALL, getOne };
