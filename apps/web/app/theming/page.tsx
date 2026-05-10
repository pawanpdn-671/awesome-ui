import { ThemingPlayground } from "@/components/theming-playground";

export const metadata = {
  title: "Theme Customizer - AwesomeUI",
  description:
    "Customize your AwesomeUI theme with live previews. Choose from design tokens defined in @awesomeui/tokens.",
};

export default function ThemingPage() {
  return <ThemingPlayground />;
}
