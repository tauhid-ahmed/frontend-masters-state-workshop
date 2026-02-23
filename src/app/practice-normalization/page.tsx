"use client";

import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

// --- INITIAL NESTED TYPES ---
interface Task {
  id: string;
  text: string;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[]; // Nested tasks
}

interface State {
  categories: Category[];
}

// --- NESTED REDUCER (The "Hard" way) ---
type Action =
  | { type: "ADD_CATEGORY"; name: string }
  | { type: "ADD_TASK"; categoryId: string; text: string }
  | { type: "DELETE_TASK"; categoryId: string; taskId: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [
          ...state.categories,
          { id: crypto.randomUUID(), name: action.name, tasks: [] },
        ],
      };

    case "ADD_TASK":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? {
                ...cat,
                tasks: [
                  ...cat.tasks,
                  { id: crypto.randomUUID(), text: action.text },
                ],
              }
            : cat,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.categoryId
            ? { ...cat, tasks: cat.tasks.filter((t) => t.id !== action.taskId) }
            : cat,
        ),
      };

    default:
      return state;
  }
}

export default function NormalizationPractice() {
  const [state, dispatch] = useReducer(reducer, { categories: [] });
  const [catName, setCatName] = useState("");

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Normalization Practice</h1>
        <p className="text-muted-foreground">
          Currently using <b>Nested State</b>. We will refactor this to{" "}
          <b>Normalized State</b> chunk by chunk.
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="New Category (e.g. Work, Home)"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
          <Button
            onClick={() => {
              if (catName) {
                dispatch({ type: "ADD_CATEGORY", name: catName });
                setCatName("");
              }
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {state.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Task Form */}
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "taskText",
                  ) as HTMLInputElement;
                  if (input.value) {
                    dispatch({
                      type: "ADD_TASK",
                      categoryId: category.id,
                      text: input.value,
                    });
                    input.value = "";
                  }
                }}
              >
                <Input name="taskText" placeholder="Add task..." />
                <Button size="sm" type="submit">
                  Add
                </Button>
              </form>

              {/* Task List */}
              <ul className="space-y-2">
                {category.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-muted p-2 rounded"
                  >
                    <span>{task.text}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        dispatch({
                          type: "DELETE_TASK",
                          categoryId: category.id,
                          taskId: task.id,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
