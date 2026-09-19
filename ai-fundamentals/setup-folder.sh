#!/usr/bin/env bash

# Array of topics matching the index file
modules=(
  "01-llm-fundamentals:01. LLM API Protocols & Token Mechanics"
  "02-prompt-engineering:02. Prompt & Context Engineering"
  "03-structured-outputs:03. Structured Outputs & Schema Enforcement"
  "04-embeddings-vector-search:04. Embeddings & Vector Search Foundations"
  "05-rag-systems:05. Production RAG Architecture"
  "06-postgres-pgvector:06. Vector Databases: PostgreSQL + pgvector"
  "07-tool-calling:07. Function Calling & Tool Execution"
  "08-agentic-langgraph:08. Agentic Workflows & State Machines (LangGraph)"
  "09-fastapi-cloud-run:09. Asynchronous AI Serving with FastAPI & Cloud Run"
  "10-evals-observability:10. AI Evaluation & System Observability"
)

for item in "${modules[@]}"; do
  file="${item%%:*}.html"
  title="${item##*:}"
  
  cat <<EOF > "$file"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title | AI Engineering</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>mermaid.initialize({ startOnLoad: true, theme: 'neutral' });</script>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 1.5rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    nav a { color: #38bdf8; text-decoration: none; font-weight: bold; }
    h1 { margin-top: 1rem; color: #38bdf8; }
    .box { background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border: 1px solid #334155; }
  </style>
</head>
<body>
  <nav><a href="index.html">&larr; Back to Curriculum Index</a></nav>
  <h1>$title</h1>
  <div class="box">
    <p><strong>Status:</strong> Draft in preparation.</p>
    <p>This module covers systems engineering, trade-offs, architecture patterns, and mobile-to-AI paradigm shifts for <strong>$title</strong>.</p>
  </div>
</body>
</html>
EOF
done

echo "Generated 10 tutorial placeholder pages."
