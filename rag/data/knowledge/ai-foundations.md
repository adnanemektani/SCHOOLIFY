# AI foundations for learners

Artificial intelligence is a family of methods that help computers find patterns, make predictions, or generate useful outputs from data.

## Core concepts

- **Data** is the collection of examples used to learn or evaluate a system.
- **A model** is a learned representation or set of parameters used to make a decision.
- **Training** adjusts a model using an objective and examples.
- **Inference** is the use of a trained model to answer a new input.
- **A prompt** is the context and instruction given to a generative model.
- **An embedding** is a numerical representation of meaning that supports similarity search.

## A reliable AI workflow

1. Define the task and the success criteria.
2. Prepare representative, safe data.
3. Choose the simplest model that can test the idea.
4. Evaluate with examples that were not used for tuning.
5. Add human review where mistakes have a meaningful cost.
6. Monitor quality, cost, latency, and safety after deployment.

## RAG

Retrieval-augmented generation (RAG) searches a curated knowledge collection before generating an answer. The retrieved passages are supplied to the language model as context, which makes answers easier to ground and update.

RAG is not a guarantee of truth. Sources should still be relevant, current, and trustworthy. Ask the assistant for its sources and verify important claims.

## Good prompting

A useful prompt states the role, audience, goal, constraints, context, and expected output format. For study questions, ask for an explanation, an example, a counterexample, and a short check question. Avoid asking a model to invent Schoolify pricing, schedules, or certifications.
