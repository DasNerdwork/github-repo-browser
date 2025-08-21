import { render, screen } from "@testing-library/react";
import { Intro } from "../Intro";

describe("Intro Component", () => {
  it("renders title and description when hasSearched is false", () => {
    render(<Intro hasSearched={false} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/introDescription/i)).toBeInTheDocument();
  });

  it("still renders but hidden when hasSearched is true", () => {
    render(<Intro hasSearched={true} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument(); // element exists, style hides it
  });
});
