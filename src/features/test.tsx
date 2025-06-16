import { Button } from "@/components/ui/button";

export const TestComponent = () => {
  return (
    <div className="text-red-500">
      <p>test</p>
      <Button variant="destructive" size="sm">
        <p>Hello World</p>
      </Button>
    </div>
  );
};
