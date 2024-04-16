function parseISOString(isoString) {
  // Parse the ISO date string
  const date = new Date(isoString);
  
  // Get the components of the date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // Format the date as desired
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedDate;
}

export default parseISOString;

