export function getTimeGreeting(name?: string): string {
  const hour = new Date().getHours();
  let period = "morning";
  if (hour >= 12 && hour < 17) period = "afternoon";
  else if (hour >= 17) period = "evening";

  const label = name ? `, ${name}` : "";
  return `Good ${period}${label}`;
}
