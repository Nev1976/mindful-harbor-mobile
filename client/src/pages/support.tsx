export default function Support() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-2"><strong>Email:</strong> mindfulharborapp@gmail.com</p>
        <p className="mb-2"><strong>Response Time:</strong> Within 24 hours</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How do I track my habits?</h3>
            <p>Navigate to the Habits tab and tap the circle next to any habit to mark it complete for today.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Can I create custom habits?</h3>
            <p>Yes! In the Habits section, tap "Add Habit" to create your own mindfulness practices.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">How often do reflection prompts change?</h3>
            <p>New reflection prompts are provided daily, with over 365 unique prompts available.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">What are micro-moments?</h3>
            <p>Micro-moments are quick 30-60 second mindfulness activities you can do anywhere, anytime.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
        <p>Your data is stored locally and never shared with third parties. We respect your privacy and mental health journey.</p>
      </section>
    </div>
  );
}