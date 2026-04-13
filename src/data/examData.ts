export interface Story {
  title: string;
  content: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ExamData {
  stories: Story[];
  questions: Question[];
  questionsPerStory: number;
}

export const examData = {
  primary: {
    stories: [
      {
        title: "The Magic Garden",
        content: `Once upon a time, there was a little girl named Maya who loved to explore. One sunny morning, she discovered a hidden door behind her grandmother's old cottage. Curious, she opened it and found herself in the most beautiful garden she had ever seen.

The garden was filled with flowers of every color imaginable - red roses, yellow sunflowers, purple lilies, and orange marigolds. But these weren't ordinary flowers. Each flower could sing a different melody! The roses hummed lullabies, the sunflowers sang cheerful songs, and the lilies played peaceful tunes.

In the middle of the garden stood a wise old tree with a friendly face carved into its bark. The tree spoke to Maya in a gentle voice, "Welcome to the Magic Garden, young one. Here, every plant has a special gift. If you take care of them with love and kindness, they will bring joy to everyone."

Maya spent the whole day in the garden, watering the plants, singing to them, and listening to their beautiful songs. When it was time to go home, the wise tree gave her a small seed. "Plant this in your own garden," it said, "and remember to treat it with love."

Maya planted the seed at home, and soon a beautiful singing flower grew, bringing happiness to her entire neighborhood.`
      },
      {
        title: "The Brave Little Turtle",
        content: `Tommy the turtle lived in a peaceful pond with his family. Unlike other turtles, Tommy was very curious about the world beyond the pond. One day, he decided to go on an adventure.

"Be careful, Tommy!" warned his mother. "The world outside can be dangerous for a small turtle."

But Tommy was determined. He slowly made his way across the grass, over a small hill, and toward the nearby forest. Along the way, he met a friendly rabbit named Rosie.

"Where are you going, little turtle?" asked Rosie.

"I want to see the big waterfall I've heard so much about," replied Tommy.

"That's very far away," said Rosie. "But I'll help you get there!"

Together, they traveled through the forest. When they encountered a deep ditch, Rosie helped Tommy cross it. When they got tired, they rested under shady trees. Finally, after a long journey, they reached the magnificent waterfall.

Tommy was amazed by its beauty - the water sparkled in the sunlight like diamonds, and rainbows danced in the mist. "It was worth the journey," Tommy said happily.

The two friends returned home, and Tommy realized that with courage and good friends, you can achieve anything.`
      }
    ],
    questions: [
      {
        question: "What did Maya discover behind her grandmother's cottage?",
        options: [
          "A hidden treasure chest",
          "A hidden door leading to a garden",
          "A secret cave",
          "A magical mirror"
        ],
        correctAnswer: "A hidden door leading to a garden"
      },
      {
        question: "What special ability did the flowers in the Magic Garden have?",
        options: [
          "They could fly",
          "They could change colors",
          "They could sing melodies",
          "They could talk to animals"
        ],
        correctAnswer: "They could sing melodies"
      },
      {
        question: "What gift did the wise tree give to Maya?",
        options: [
          "A golden key",
          "A magic wand",
          "A small seed",
          "A singing bird"
        ],
        correctAnswer: "A small seed"
      },
      {
        question: "What lesson did Maya learn from the Magic Garden?",
        options: [
          "To be brave and adventurous",
          "To treat plants with love and kindness",
          "To never give up on dreams",
          "To share with others"
        ],
        correctAnswer: "To treat plants with love and kindness"
      },
      {
        question: "Who helped Tommy the turtle on his journey?",
        options: [
          "A wise owl",
          "His mother",
          "A friendly rabbit named Rosie",
          "A kind fish"
        ],
        correctAnswer: "A friendly rabbit named Rosie"
      },
      {
        question: "What did Tommy want to see on his adventure?",
        options: [
          "The ocean",
          "A big waterfall",
          "A mountain top",
          "A distant city"
        ],
        correctAnswer: "A big waterfall"
      },
      {
        question: "How did Rosie help Tommy during the journey?",
        options: [
          "She carried him on her back",
          "She gave him food",
          "She helped him cross a deep ditch",
          "She showed him a shortcut"
        ],
        correctAnswer: "She helped him cross a deep ditch"
      },
      {
        question: "What important lesson did Tommy learn from his adventure?",
        options: [
          "Stay at home where it's safe",
          "With courage and good friends, you can achieve anything",
          "Always listen to your mother",
          "Never trust strangers"
        ],
        correctAnswer: "With courage and good friends, you can achieve anything"
      }
    ],
    questionsPerStory: 4
  },

  highschool: {
    stories: [
      {
        title: "Mahatma Gandhi - The Father of the Nation",
        content: `Mohandas Karamchand Gandhi, known as Mahatma Gandhi, was born on October 2, 1869, in Porbandar, Gujarat. He became one of the most influential leaders in India's struggle for independence from British colonial rule.

After completing his law studies in England, Gandhi went to South Africa, where he faced racial discrimination. This experience transformed him into a civil rights activist. He developed the philosophy of Satyagraha - a non-violent resistance against injustice, based on truth and courage.

Returning to India in 1915, Gandhi led numerous movements against British rule. The Non-Cooperation Movement (1920), the Salt March (1930), and the Quit India Movement (1942) were pivotal in India's freedom struggle. The Salt March, where Gandhi walked 240 miles to the Arabian Sea to make salt in defiance of British salt laws, became a powerful symbol of peaceful resistance.

Gandhi believed in simplicity and self-reliance. He wore simple khadi clothes, promoted village industries, and fought against untouchability and social discrimination. His philosophy inspired civil rights movements worldwide, including Martin Luther King Jr.'s fight for racial equality in America.

On August 15, 1947, India gained independence, largely due to Gandhi's tireless efforts. However, he was deeply saddened by the partition of India and Pakistan. On January 30, 1948, Gandhi was assassinated by Nathuram Godse. His legacy of non-violence, truth, and justice continues to inspire millions around the world.

Gandhi's principles - Ahimsa (non-violence), Satya (truth), and Sarvodaya (welfare of all) - remain relevant today, reminding us that real change comes not through violence, but through moral courage and peaceful resistance.`
      },
      {
        title: "Bhagat Singh - The Young Revolutionary",
        content: `Bhagat Singh was born on September 28, 1907, in Punjab, into a family deeply involved in India's freedom movement. From a young age, he witnessed the brutality of British rule, including the Jallianwala Bagh massacre in 1919, which profoundly affected him.

As a teenager, Bhagat Singh joined the Hindustan Republican Association and later formed the Hindustan Socialist Republican Association. Unlike many leaders who followed non-violent methods, Bhagat Singh believed that armed revolution was necessary to overthrow British imperialism.

In 1928, the British police killed Lala Lajpat Rai during a peaceful protest. Seeking revenge, Bhagat Singh and his associates killed British police officer John Saunders, whom they mistakenly believed was responsible. To avoid arrest, they went underground.

On April 8, 1929, Bhagat Singh and Batukeshwar Dutt threw non-lethal bombs in the Central Legislative Assembly in Delhi. They could have escaped but chose to be arrested to use the trial as a platform to spread their revolutionary ideas. In court, they shouted the famous slogan "Inquilab Zindabad" (Long Live Revolution).

During his imprisonment, Bhagat Singh went on a hunger strike demanding equal rights for Indian and British prisoners. His courage and intellectual depth impressed many. He read extensively about socialism, anarchism, and revolutionary movements worldwide.

On March 23, 1931, at the young age of 23, Bhagat Singh was hanged along with his comrades Rajguru and Sukhdev. Before his execution, he reportedly said, "They may kill me, but they cannot kill my ideas." His sacrifice inspired countless young Indians to join the freedom struggle.

Bhagat Singh remains an enduring symbol of youthful patriotism, courage, and revolutionary zeal. His vision of a free, secular, and socialist India continues to inspire generations.`
      }
    ],
    questions: [
      {
        question: "What philosophy did Mahatma Gandhi develop during his time in South Africa?",
        options: [
          "Armed revolution",
          "Satyagraha - non-violent resistance",
          "Socialist ideology",
          "Religious reformation"
        ],
        correctAnswer: "Satyagraha - non-violent resistance"
      },
      {
        question: "What was the significance of the Salt March in 1930?",
        options: [
          "It was the first armed rebellion against British",
          "It became a powerful symbol of peaceful resistance",
          "It led to immediate independence",
          "It united all political parties"
        ],
        correctAnswer: "It became a powerful symbol of peaceful resistance"
      },
      {
        question: "Which of the following was NOT one of Gandhi's core principles?",
        options: [
          "Ahimsa (non-violence)",
          "Satya (truth)",
          "Sarvodaya (welfare of all)",
          "Armed resistance"
        ],
        correctAnswer: "Armed resistance"
      },
      {
        question: "What deeply saddened Gandhi even after India gained independence?",
        options: [
          "Economic poverty",
          "The partition of India and Pakistan",
          "Continuation of British trade",
          "Political disagreements"
        ],
        correctAnswer: "The partition of India and Pakistan"
      },
      {
        question: "Which historical event profoundly affected young Bhagat Singh?",
        options: [
          "The Salt March",
          "The Jallianwala Bagh massacre",
          "The Non-Cooperation Movement",
          "The Round Table Conference"
        ],
        correctAnswer: "The Jallianwala Bagh massacre"
      },
      {
        question: "Why did Bhagat Singh and Batukeshwar Dutt choose to be arrested after the Assembly bombing?",
        options: [
          "They were caught by police",
          "They felt guilty about their actions",
          "To use the trial as a platform to spread revolutionary ideas",
          "They ran out of money to escape"
        ],
        correctAnswer: "To use the trial as a platform to spread revolutionary ideas"
      },
      {
        question: "What was the famous slogan shouted by Bhagat Singh in court?",
        options: [
          "Jai Hind",
          "Vande Mataram",
          "Inquilab Zindabad",
          "Quit India"
        ],
        correctAnswer: "Inquilab Zindabad"
      },
      {
        question: "How old was Bhagat Singh when he was executed?",
        options: [
          "19 years",
          "21 years",
          "23 years",
          "25 years"
        ],
        correctAnswer: "23 years"
      }
    ],
    questionsPerStory: 4
  }
};
