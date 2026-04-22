import Papa from 'papaparse';

export interface GameData {
  id: string;
  nombre: string;
  tamañoGB: number;
  categoria: string;
}

const SHEET_ID = '1WgrBndxlA_n6JE5UITRy27LduXsdPG9LjPYfG2k46zA';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export async function fetchGamesData(): Promise<GameData[]> {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error('Error al cargar los datos desde Google Sheets');
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const games: GameData[] = results.data
            .map((row: any, index: number) => {
              // Extract the columns specified by the user:
              // Nombre, Peso Aproximado (GB), Categoría Principal
              const nombre = row['Nombre'] || row['nombre'] || '';
              const tamañoRaw = row['Peso Aproximado (GB)'] || row['peso aproximado (gb)'] || '0';
              const categoria = row['Categoría Principal'] || row['categoría principal'] || 'Sin Categoría';
              
              // Clean up the size value (e.g. "15,5" to 15.5 or "15 GB" to 15)
              let tamañoGB = parseFloat(tamañoRaw.replace(',', '.').replace(/[^\d.]/g, ''));
              if (isNaN(tamañoGB)) tamañoGB = 0;

              return {
                id: `game-${index}`,
                nombre: nombre.trim(),
                tamañoGB,
                categoria: categoria.trim(),
              };
            })
            // Filter out empty rows
            .filter((game) => game.nombre !== '');
            
          resolve(games);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Fetch Games Error:', error);
    return [];
  }
}
