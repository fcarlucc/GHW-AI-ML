# Setup Rapido - Privacy-Aware RAG Bot

## 📋 Checklist Pre-Lancio

### 1. Configura Auth0 (5 minuti)

1. Vai su [Auth0 Dashboard](https://manage.auth0.com/)
2. Crea una **Regular Web Application**
3. Nelle impostazioni dell'app:
   - **Allowed Callback URLs**: 
     - Localhost: `http://localhost:3000/api/auth/callback`
     - Codespaces: `https://YOUR-CODESPACE-URL.app.github.dev/api/auth/callback`
   - **Allowed Logout URLs**: 
     - Localhost: `http://localhost:3000`
     - Codespaces: `https://YOUR-CODESPACE-URL.app.github.dev`
   - **Allowed Web Origins**: Stesso come sopra
4. Salva le modifiche

> **Nota per Codespaces**: Sostituisci `YOUR-CODESPACE-URL` con il tuo URL Codespace attuale

### 2. Ottieni Groq API Key (2 minuti)

1. Vai su [Groq Console](https://console.groq.com/)
2. Registrati (GRATIS, senza carta di credito)
3. Vai su API Keys
4. Crea una nuova API key
5. Copia la chiave (inizia con `gsk_...`)

### 3. Configura Environment Variables

Apri `.env.local` e compila:

```env
# Già generato per te
AUTH0_SECRET='e38003990ff465acb36402ad15ddde11bd5bb8f7d9bf2a643623e77f2076b7ee'

# Per localhost:
AUTH0_BASE_URL='http://localhost:3000'
# Per Codespaces (sostituisci con il tuo URL):
# AUTH0_BASE_URL='https://YOUR-CODESPACE-URL.app.github.dev'

# Copia da Auth0 Dashboard (usa il dominio regionale corretto, es. .us.auth0.com)
AUTH0_ISSUER_BASE_URL='https://TUO-DOMINIO.us.auth0.com'
AUTH0_CLIENT_ID='copia_da_auth0'
AUTH0_CLIENT_SECRET='copia_da_auth0'

# Copia da Groq Console
GROQ_API_KEY='gsk_copia_da_groq'
```

### 4. Avvia l'App

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 🧪 Test Rapidi

### Test 1: Login come Manager
1. Fai login con email contenente "manager" o "admin": `manager@company.com`
2. Chiedi: **"What are the salary bands?"**
3. ✅ **Risultato atteso**: Vedi informazioni su stipendi ($70k - $250k) e 8 domande consigliate (4 normali + 4 in rosso per manager)

### Test 2: Login come Employee  
1. Fai logout e login con: `employee@company.com` (o qualsiasi email senza "manager")
2. Chiedi: **"What are the salary bands?"**
3. ❌ **Risultato atteso**: "No documents found" / "No access to salary information"
4. Vedi: **"🔒 3 documents blocked"** e solo 4 domande consigliate
5. Nella sidebar, i documenti riservati hanno ✗ rossa

### Test 3: Documenti Pubblici
Con qualsiasi utente:
- "What are the vacation policies?" → ✅ Funziona
- "Tell me about employee benefits" → ✅ Funziona
- "How many PTO days do I get?" → ✅ Funziona

## ✅ Verifica Successo

Il progetto funziona correttamente se:

1. ✓ Manager può vedere stipendi e budget
2. ✓ Employee NON può vedere stipendi e budget  
3. ✓ Tutti possono vedere policies e benefits
4. ✓ L'app mostra quanti documenti sono stati bloccati
5. ✓ I log in console mostrano i controlli FGA

## 🔍 Debugging

### Auth0 Error "Callback URL mismatch"
→ Controlla che `http://localhost:3000/api/auth/callback` sia nelle Allowed Callback URLs

### Groq API Error  
→ Verifica che `GROQ_API_KEY` sia copiata correttamente (inizia con `gsk_`)

### "Authorization header is missing"
→ Fai logout e login di nuovo

## 📊 Logs da Controllare

Apri la console del browser e cerca:

```
[FGA] User alice@company.com can access 6/6 documents
[RAG] Returning 3 documents to LLM
[Groq] Response generated successfully
```

Se vedi `documents blocked by FGA authorization`, l'autorizzazione funziona! 🎉

## 🎯 Dimostrazione Completa

1. **Manager Flow**: Login → Chiedi salary → Vedi risultati dettagliati
2. **Employee Flow**: Login → Chiedi salary → Vedi accesso negato
3. **Mostra logs**: Console logs che mostrano FGA blocking
4. **Spiega privacy**: I documenti sensibili non arrivano MAI all'LLM

---

Tempo totale setup: **~10 minuti** ⏱️
