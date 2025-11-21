# IA PDF Assistant

Assistant IA local pour poser des questions sur vos documents PDF.

## Fonctionnalités

- Upload de fichiers PDF
- Extraction et indexation automatique du contenu
- Chat avec l'IA basé sur le contenu du document
- 100% local, gratuit, sans API externe

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │ ←→  │   Next.js   │ ←→  │   Ollama    │
│  (React)    │     │   (API)     │     │  (IA local) │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                   ┌──────┴──────┐
                   │   SQLite    │
                   │  (données)  │
                   └─────────────┘
```

## Prérequis

- Node.js 18+
- Ollama

## Installation

### 1. Installer Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows : télécharger depuis https://ollama.com
```

Télécharger les modèles :
```bash
ollama pull mistral
ollama pull nomic-embed-text
```

### 2. Installer le projet

```bash
git clone https://github.com/votre-username/IA-Pdf-Assistant.git
cd IA-Pdf-Assistant
npm install
```

### 3. Lancer l'application

```bash
# Terminal 1 : Ollama (s'il n'est pas déjà lancé)
ollama serve

# Terminal 2 : Application Next.js
npm run dev
```

Ouvrir http://localhost:3000

```bash
#Eteindre ollama après utilisation
pkill ollama
```

## Utilisation

1. Cliquer sur "Ajouter un PDF" pour uploader un document
2. Attendre l'indexation (peut prendre quelques secondes selon la taille)
3. Cliquer sur le document dans la liste
4. Poser des questions dans le chat

## Comment ça marche

### Upload d'un PDF
1. Le fichier est sauvegardé dans `uploads/`
2. Le texte est extrait du PDF
3. Le texte est découpé en chunks de ~500 caractères (pour ne pas depasser la limite IA)
4. Chaque chunk est transformé en embedding (vecteur numérique) via Ollama
5. Les chunks et embeddings sont stockés dans SQLite

### Question/Réponse
1. La question est transformée en embedding
2. On compare avec tous les embeddings des chunks (similarité cosinus)
3. Les 3 chunks les plus pertinents sont sélectionnés
4. Ces chunks + la question sont envoyés au LLM (Mistral)
5. Mistral génère une réponse basée sur le contexte

## Configuration

Modifier `.env.local` pour changer les modèles :

```bash
OLLAMA_URL=http://localhost:11434
LLM_MODEL=mistral
EMBED_MODEL=nomic-embed-text
```

Modèles recommandés :
- **LLM** : mistral, llama3.1, gemma2
- **Embeddings** : nomic-embed-text, mxbai-embed-large

## Structure du projet

```bash
IA-Pdf-Assistant/
├── src/
│   ├── app/
│   │   ├── globals.css         # Styles
│   │   ├── layout.tsx          # Template HTML
│   │   ├── page.tsx            # Page principale
│   │   └── api/
│   │       ├── upload/         # Endpoint upload PDF
│   │       ├── documents/      # Endpoint liste documents
│   │       └── chat/           # Endpoint chat
│   ├── components/
│   │   ├── upload-zone.tsx     # Bouton upload
│   │   ├── document-list.tsx   # Liste des PDFs
│   │   └── chat-panel.tsx      # Interface chat
│   └── lib/
│       ├── db.ts               # Base de données SQLite
│       ├── ollama.ts           # Client Ollama
│       ├── pdf-parser.ts       # Extraction texte PDF
│       └── rag.ts              # Logique RAG
├── uploads/                    # PDFs stockés
├── data/                       # Base SQLite
├── package.json
├── package-lock.json
├── next-env.d.ts
├── next.config.js
├── tsconfig.json
├── .env.local
├── .gitignore
└── touch next-env.d.ts
```

## Stack technique

- **Frontend** : Next.js 14, React 18, TypeScript
- **Backend** : Next.js API Routes
- **Base de données** : SQLite (better-sqlite3)
- **IA** : Ollama (Mistral pour le LLM, nomic-embed-text pour les embeddings)
- **PDF** : pdf-parse

## Limitations

- Uniquement les fichiers PDF (pas de Word, Excel)
- Les PDFs scannés (images) ne sont pas supportés
- Performance dépendante du hardware (GPU recommandé pour Ollama)

## Commandes utiles

```bash
# Lancer en développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Stopper Ollama
pkill ollama
```

## Roadmap V2

- [ ] Support multi-formats (Word, Excel)
- [ ] Système de dossiers
- [ ] Historique des conversations
- [ ] Citations avec numéros de page
- [ ] Preview du PDF
- [ ] Suppression de documents
- [ ] Streaming des réponses

## Licence

MIT License

## Auteur

**101namm**
- GitHub: [101namm](https://github.com/101namm)
- LinkedIn: [Mon profil](https://fr.linkedin.com/in/louischavaroche)

---

*Projet réalisé dans le cadre du développement de compétences*
