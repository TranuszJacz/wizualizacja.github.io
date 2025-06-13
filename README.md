# Analiza Rynku Mieszkaniowego i Wynagrodzeń w Polsce

Interaktywna aplikacja do wizualizacji danych dotyczących rynku mieszkaniowego i wynagrodzeń w Polsce w latach 2010-2024.

## 🚀 Live Demo

Aplikacja jest dostępna pod adresem: [https://wizualizacja.github.io](https://wizualizacja.github.io)

## 📊 Funkcjonalności

- **Ewolucja Cen Mieszkań** - Analiza zmian cen mieszkań w różnych województwach
- **Wykresy Wynagrodzeń** - Wizualizacja wzrostu wynagrodzeń w czasie
- **Porównanie Trendów** - Zestawienie wzrostu cen mieszkań vs wzrostu wynagrodzeń
- **Dostępność Mieszkań** - Ile m² można kupić za średnią miesięczną wypłatę

## 🛠️ Technologie

- React 19 + TypeScript
- Vite (build tool)
- Recharts (wykresy)
- Papa Parse (CSV parsing)
- GitHub Pages (hosting)

## 🚀 Instalacja i uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/[username]/wizualizacja.git
cd wizualizacja

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Build do produkcji
npm run build

# Deploy na GitHub Pages
npm run deploy
```

## 📈 Źródła danych

Dane pochodzą z oficjalnych statystyk dotyczących:
- Średnich cen lokali mieszkalnych sprzedanych w ramach transakcji rynkowych
- Przeciętnych miesięcznych wynagrodzeń brutto w województwach

## 🔧 Deployment

Projekt jest automatycznie deployowany na GitHub Pages przy każdym push do gałęzi `main` poprzez GitHub Actions.

### Manualne deployment:
```bash
npm run deploy
```

## 📝 Metodologia

**Dostępność mieszkań** obliczana jest jako:
- Cena za m² = Średnia cena mieszkania / 65 m² (założona średnia powierzchnia)
- Metrów kwadratowych za wypłatę = Miesięczne wynagrodzenie brutto / Cena za m²

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
