"use client"

export function StatsSection() {
  const stats = [
    { value: "40%", label: "Time saved on case prep" },
    { value: "500+", label: "Law firms trust us" },
    { value: "99.9%", label: "Uptime guarantee" },
    { value: "24/7", label: "Expert support" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#142650] text-primary-foreground">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm sm:text-base text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default StatsSection