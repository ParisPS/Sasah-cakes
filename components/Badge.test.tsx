import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renderiza o texto passado como children", () => {
    render(<Badge>Brigadeiro</Badge>);
    expect(screen.getByText("Brigadeiro")).toBeInTheDocument();
  });
});
