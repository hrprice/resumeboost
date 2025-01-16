import Text from "@resume-optimizer/ui/components/Text";

const HomePage = () => {
  return (
    <div className="flex justify-center bg-surface">
      <div className="bg-background container h-full flex items-center justify-center">
        <div className="flex gap-4">
          <Text variant="h4" className="text-primary-default">
            Get Started
          </Text>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
