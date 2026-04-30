import { Stage, QuestionType, Difficulty } from './types.ts';

export const MATRIX_ADVENTURE_DATA: Stage[] = [
  {
    id: 'stage-1',
    title: 'Alam Semesta Matriks',
    description: 'Menemukan partikel dasar pembentuk matriks.',
    subTopics: [
      {
        id: 'st1',
        title: 'Apa itu Matriks?',
        content: `Matriks adalah susunan bilangan yang diatur dalam baris dan kolom di dalam tanda kurung (kurung biasa atau kurung siku). 

Bilangan-bilangan yang terdapat dalam matriks disebut elemen atau entri matriks. Matriks biasanya diberi nama dengan huruf kapital (A, B, C, ...).`,
        examples: [
          { label: 'A = [[1, 2], [3, 4]] (Matriks 2x2)', data: [[1, 2], [3, 4]] },
          { label: 'B = [[5, 6, 7], [8, 9, 10]] (Matriks 2x3)', data: [[5, 6, 7], [8, 9, 10]] }
        ]
      },
      {
        id: 'st2',
        title: 'Misteri Ordo',
        content: `Ordo matriks adalah ukuran matriks yang dinyatakan dalam (jumlah baris) x (jumlah kolom). 

Misalnya, jika matriks A memiliki 3 baris dan 2 kolom, maka ordonya adalah 3 x 2.`,
        examples: [
          { label: 'Ordo 1x3 (Matriks Baris): A = [1, 2, 3]', data: [1, 2, 3] },
          { label: 'Ordo 3x1 (Matriks Kolom): B = [[1], [2], [3]]', data: [[1], [2], [3]] },
          { label: 'Ordo 2x2 (Matriks Persegi): C = [[1, 2], [3, 4]]', data: [[1, 2], [3, 4]] }
        ]
      }
    ],
    quizzes: [
      {
        id: 'q1',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Matriks yang memiliki 3 baris dan 4 kolom disebut matriks berordo...',
        options: ['3x4', '4x3', '12', '3x3'],
        correctAnswer: '3x4',
        explanation: 'Ordo ditulis sebagai Baris x Kolom. Jadi 3 baris dan 4 kolom adalah 3x4.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q2',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Berapakah jumlah elemen dalam matriks 2x5?',
        correctAnswer: '10',
        explanation: 'Jumlah elemen didapat dari perkalian baris dan kolom: 2 x 5 = 10.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q3',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Manakah tanda kurung yang Benar untuk matriks?',
        options: ['( ) atau [ ]', '{ } atau < >', '/ / atau | |', '" " atau \' \''],
        correctAnswer: '( ) atau [ ]',
        explanation: 'Matriks secara standar menggunakan kurung biasa ( ) atau kurung siku [ ].',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q4',
        type: QuestionType.COMPLEX_MC,
        question: 'Pilih semua yang merupakan elemen dari matriks A = [[7, 8], [9, 0]]',
        options: ['7', '8', '9', '6'],
        correctAnswer: ['7', '8', '9'],
        explanation: 'Elemennya adalah 7, 8, 9, dan 0.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q5',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Pasangkan Matriks dengan Ordonya!',
        options: ['[1, 2, 3]', '[[1],[2],[3]]', '[[1,2],[3,4]]', '[[1, 2], [3, 4], [5, 6]]'],
        correctAnswer: {
          '[1, 2, 3]': '1x3',
          '[[1],[2],[3]]': '3x1',
          '[[1,2],[3,4]]': '2x2',
          '[[1, 2], [3, 4], [5, 6]]': '3x2'
        },
        explanation: 'Ingat: Baris × Kolom. Matriks terakhir memiliki 3 baris dan 2 kolom.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q6',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Manakah matriks yang memiliki ordo 2x1?',
        options: ['[[1, 2]]', '[[1], [2]]', '[[1, 2], [3, 4]]', '[1, 2]'],
        correctAnswer: '[[1], [2]]',
        explanation: 'Matriks berordo 2x1 memiliki 2 baris dan 1 kolom (matriks kolom).',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q7',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Klasifikasikan jenis ordo matriks!',
        options: ['[[0,0],[0,0]]', '[5, 6, 7, 8]', '[[1,0,0],[0,1,0],[0,0,1]]', '[[9],[10]]', '[[1,2,3],[4,5,6]]'],
        correctAnswer: {
          '[[0,0],[0,0]]': '2x2',
          '[5, 6, 7, 8]': '1x4',
          '[[1,0,0],[0,1,0],[0,0,1]]': '3x3',
          '[[9],[10]]': '2x1',
          '[[1,2,3],[4,5,6]]': '2x3'
        },
        explanation: 'Menghitung baris (horizontal) lalu kolom (vertikal) adalah kunci menentukan ordo.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q8',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Berapakah jumlah elemen dalam matriks berordo 4x3?',
        correctAnswer: '12',
        explanation: 'Jumlah elemen = baris x kolom = 4 x 3 = 12.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q9',
        type: QuestionType.COMPLEX_MC,
        question: 'Mana saja yang termasuk ordo matriks persegi?',
        options: ['1x1', '2x2', '3x2', '4x4'],
        correctAnswer: ['1x1', '2x2', '4x4'],
        explanation: 'Matriks persegi memiliki jumlah baris dan kolom yang sama.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q-vis-1',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Apa ordo dari matriks visual ini?',
        matrixData: [[1, 2, 3]],
        options: ['1x3', '3x1', '1x1', '3x3'],
        correctAnswer: '1x3',
        explanation: 'Matriks tersebut memiliki 1 baris dan 3 kolom.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q-vis-2',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Berapakah elemen di baris ke-2 kolom ke-1?',
        matrixData: [[4, 5], [7, 8]],
        options: ['4', '5', '7', '8'],
        correctAnswer: '7',
        explanation: 'Baris kedua adalah [7, 8], elemen pertamanya adalah 7.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q-vis-3',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Matriks apakah yang ditampilkan secara visual ini?',
        matrixData: [[0, 0, 0], [0, 0, 0]],
        options: ['Matriks Nol', 'Matriks Identitas', 'Matriks Baris', 'Matriks Kolom'],
        correctAnswer: 'Matriks Nol',
        explanation: 'Semua elemennya adalah nol, maka disebut Matriks Nol.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q-vis-4',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Berapakah ordo matriks ini?',
        matrixData: [[1], [2], [3], [4]],
        options: ['4x1', '1x4', '4x4', '1x1'],
        correctAnswer: '4x1',
        explanation: 'Memiliki 4 baris dan 1 kolom.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q-vis-5',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Berapakah hasil elemen a11 + a22?',
        matrixData: [[5, 2], [1, 10]],
        options: ['15', '12', '11', '10'],
        correctAnswer: '15',
        explanation: 'a11 = 5, a22 = 10. Hasilnya 5 + 10 = 15.',
        difficulty: Difficulty.HARD
      }
    ]
  },
  {
    id: 'stage-2',
    title: 'Hutan Kristal Matriks',
    description: 'Mengenal 7 spesies unik dari kristal matriks.',
    subTopics: [
      {
        id: 'st2-1',
        title: '1. Matriks Nol',
        content: `Matriks Nol adalah matriks yang semua elemennya bernilai nol (0). Matriks ini biasanya dilambangkan dengan huruf O.`,
        examples: [
          { label: 'O = [[0, 0], [0, 0]]', data: [[0, 0], [0, 0]] },
          { label: 'O = [0, 0, 0]', data: [0, 0, 0] }
        ]
      },
      {
        id: 'st2-2',
        title: '2. Matriks Baris',
        content: `Matriks Baris adalah matriks yang hanya terdiri dari satu baris saja. Ordonya selalu 1 x n.`,
        examples: [
          { label: 'A = [1, 2, 3]', data: [1, 2, 3] },
          { label: 'A = [10, 20]', data: [10, 20] }
        ]
      },
      {
        id: 'st2-3',
        title: '3. Matriks Kolom',
        content: `Matriks Kolom adalah matriks yang hanya terdiri dari satu kolom saja. Ordonya selalu m x 1.`,
        examples: [
          { label: 'B = [[5], [6], [7]]', data: [[5], [6], [7]] },
          { label: 'B = [[1], [8]]', data: [[1], [8]] }
        ]
      },
      {
        id: 'st2-4',
        title: '4. Matriks Persegi',
        content: `Matriks Persegi adalah matriks yang memiliki jumlah baris sama dengan jumlah kolom (m = n). Ordonya sering disebut n x n.`,
        examples: [
          { label: 'C = [[1, 2], [3, 4]] (Ordo 2x2)', data: [[1, 2], [3, 4]] },
          { label: 'C = [[1, 0, 0], [0, 1, 0], [0, 0, 1]] (Ordo 3x3)', data: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] }
        ]
      },
      {
        id: 'st2-5',
        title: '5. Matriks Diagonal',
        content: `Matriks Diagonal adalah matriks persegi yang semua elemennya nol, kecuali elemen pada diagonal utamanya.`,
        examples: [
          { label: 'D = [[5, 0], [0, 7]]', data: [[5, 0], [0, 7]] },
          { label: 'D = [[1, 0, 0], [0, 9, 0], [0, 0, 2]]', data: [[1, 0, 0], [0, 9, 0], [0, 0, 2]] }
        ]
      },
      {
        id: 'st2-6',
        title: '6. Matriks Segitiga',
        content: `Matriks Segitiga adalah matriks persegi yang elemen di bawah atau di atas diagonal utamanya bernilai nol. Terdiri dari Segitiga Atas dan Segitiga Bawah.`,
        examples: [
          { label: 'Segitiga Atas: [[1, 2, 3], [0, 4, 5], [0, 0, 6]]', data: [[1, 2, 3], [0, 4, 5], [0, 0, 6]] },
          { label: 'Segitiga Bawah: [[1, 0, 0], [2, 3, 0], [4, 5, 6]]', data: [[1, 0, 0], [2, 3, 0], [4, 5, 6]] }
        ]
      },
      {
        id: 'st2-7',
        title: '7. Matriks Identitas',
        content: `Matriks Identitas adalah matriks diagonal yang semua elemen diagonal utamanya bernilai 1. Biasanya dilambangkan dengan huruf I.`,
        examples: [
          { label: 'I = [[1, 0], [0, 1]]', data: [[1, 0], [0, 1]] },
          { label: 'I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]', data: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] }
        ]
      }
    ],
    quizzes: [
      {
        id: 'q2-1',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Matriks yang semua elemennya nol disebut...',
        options: ['Matriks Nol', 'Matriks Kolom', 'Matriks Identitas', 'Matriks Kosong'],
        correctAnswer: 'Matriks Nol',
        explanation: 'Sesuai namanya, matriks nol hanya berisi angka nol.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q2-2',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Tentukan jenis matriks berikut!',
        options: ['[1, 2]', '[[1], [2]]', '[[1,0],[0,1]]', '[[5,0],[0,7]]'],
        correctAnswer: {
          '[1, 2]': 'Baris',
          '[[1], [2]]': 'Kolom',
          '[[1,0],[0,1]]': 'Identitas',
          '[[5,0],[0,7]]': 'Diagonal'
        },
        explanation: 'Baris=1 baris, Kolom=1 kolom, Identitas= diagonal utamanya 1, Diagonal= nol selain diagonal utama.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q2-3',
        type: QuestionType.COMPLEX_MC,
        question: 'Mana saja syarat Matriks Identitas?',
        options: ['Harus Matriks Persegi', 'Diagonal Utama bernilai 1', 'Semua elemen nol', 'Elemen lain selain diagonal adalah nol'],
        correctAnswer: ['Harus Matriks Persegi', 'Diagonal Utama bernilai 1', 'Elemen lain selain diagonal adalah nol'],
        explanation: 'Matriks Identitas adalah matriks diagonal (persegi) yang diagonal utamanya 1.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q2-4',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Matriks Baris memiliki jumlah baris sebanyak...',
        correctAnswer: '1',
        explanation: 'Matriks Baris didefinisikan sebagai matriks yang hanya memiliki SATU baris.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q2-5',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Matriks berordo 3x3 termasuk jenis matriks...',
        options: ['Persegi', 'Baris', 'Kolom', 'Nol'],
        correctAnswer: 'Persegi',
        explanation: 'Karena Baris = Kolom (3=3), maka disebut Matriks Persegi.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q2-6',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Lambang standar untuk Matriks Identitas adalah...',
        options: ['I', 'A', 'O', 'M'],
        correctAnswer: 'I',
        explanation: 'I adalah simbol universal untuk Identity Matrix (Matriks Identitas).',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q2-7',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Klasifikasikan Matriks Segitiga!',
        options: ['Atas', 'Bawah'],
        correctAnswer: {
          'Atas': 'Nol di bawah diagonal',
          'Bawah': 'Nol di atas diagonal'
        },
        explanation: 'Segitiga Atas memiliki elemen non-nol di bagian atas (nol di bawah), sebaliknya untuk Segitiga Bawah.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q2-8',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Jika matriks O memiliki 5 elemen nol, maka disebut Matriks...',
        correctAnswer: 'Nol',
        explanation: 'Matriks yang semua elemennya nol adalah matriks nol.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q2-9',
        type: QuestionType.COMPLEX_MC,
        question: 'Mana saja yang merupakan matriks diagonal?',
        options: ['[[2,0],[0,3]]', '[[1,0],[0,1]]', '[[1,2],[0,1]]', '[[0,0],[0,0]]'],
        correctAnswer: ['[[2,0],[0,3]]', '[[1,0],[0,1]]', '[[0,0],[0,0]]'],
        explanation: 'Matriks diagonal adalah matriks persegi di mana elemen selain diagonal utama adalah nol.',
        difficulty: Difficulty.HARD
      }
    ]
  },
  {
    id: 'stage-3',
    title: 'Kuil Transformasi Matriks',
    description: 'Mempelajari cara mengubah dan membandingkan struktur matriks.',
    subTopics: [
      {
        id: 'st3-1',
        title: 'Transpose Matriks',
        content: `Transpose matriks adalah perubahan bentuk matriks di mana baris diubah menjadi kolom dan kolom diubah menjadi baris. Transpose matriks A biasanya dilambangkan dengan Aᵀ atau A'.
        
Jika matriks A berordo m x n, maka Aᵀ akan berordo n x m.`,
        examples: [
          { label: 'A = [[1, 2, 3], [4, 5, 6]] (2x3)', data: [[1, 2, 3], [4, 5, 6]] },
          { label: "Aᵀ = [[1, 4], [2, 5], [3, 6]] (3x2)", data: [[1, 4], [2, 5], [3, 6]] }
        ]
      },
      {
        id: 'st3-2',
        title: 'Kesamaan Dua Matriks',
        content: `Dua buah matriks A dan B dikatakan sama (A = B) jika dan hanya jika:
1. Memiliki ordo yang sama.
2. Setiap elemen yang seletak (bersesuaian) nilainya sama.

Artinya, elemen baris i kolom j pada matriks A harus sama dengan elemen baris i kolom j pada matriks B.`,
        examples: [
          { label: 'A = [[1, 2], [3, 4]]', data: [[1, 2], [3, 4]] },
          { label: 'B = [[1, 2], [3, 4]] -> A = B', data: [[1, 2], [3, 4]] }
        ]
      }
    ],
    quizzes: [
      {
        id: 'q3-1',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Jika baris pertama matriks A adalah [5, 6, 7], maka kolom pertama Aᵀ adalah...',
        options: ['[5, 6, 7]', '[[5], [6], [7]]', '[7, 6, 5]', '[[5, 6, 7]]'],
        correctAnswer: '[[5], [6], [7]]',
        explanation: 'Dalam transpose, baris berubah menjadi kolom. Jadi baris [5, 6, 7] menjadi kolom pertama.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q3-2',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Simbol standar untuk transpose matriks A adalah...',
        correctAnswer: 'A^T',
        explanation: "Transpose biasanya dilambangkan dengan huruf T kapital di atas (super-script).",
        difficulty: Difficulty.EASY
      },
      {
        id: 'q3-3',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Dua matriks dikatakan sama jika memiliki ordo sama dan elemen-elemen yang ... nilainya sama.',
        options: ['Seletak', 'Berlawanan', 'Berbeda', 'Diagonal'],
        correctAnswer: 'Seletak',
        explanation: 'Elemen yang seletak berarti elemen yang berada pada baris dan kolom yang sama di kedua matriks.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q3-4',
        type: QuestionType.COMPLEX_MC,
        question: 'Syarat utama agar dua matriks bisa dikatakan Sama adalah...',
        options: ['Ordonya harus sama', 'Nilai elemen seletak sama', 'Hanya boleh matriks persegi', 'Semua elemen harus positif'],
        correctAnswer: ['Ordonya harus sama', 'Nilai elemen seletak sama'],
        explanation: 'Dua matriks harus identik dalam ukuran (ordo) dan isi (elemen seletak).',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q3-5',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Tentukan transpose dari matriks-matriks ini!',
        options: ['[[1,2]]', '[[1],[2]]', '[[0,1],[2,3]]'],
        correctAnswer: {
          '[[1,2]]': '[[1],[2]]',
          '[[1],[2]]': '[[1,2]]',
          '[[0,1],[2,3]]': '[[0,2],[1,3]]'
        },
        explanation: 'Baris beralih jadi kolom. Matriks baris jadi kolom, ordo 2x2 elemen diagonal tetap, lainnya tukar posisi.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q3-6',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Jika A = [[x, 2], [3, 4]] dan B = [[5, 2], [3, 4]], agar A = B maka nilai x adalah...',
        correctAnswer: '5',
        explanation: 'Karena A = B, maka elemen seletak harus sama. x di baris 1 kolom 1 A harus sama dengan 5 di posisi yang sama pada B.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q3-7',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Jika matriks berordo 4x2 di-transpose, maka ordo barunya adalah...',
        options: ['2x4', '4x2', '8', '2x2'],
        correctAnswer: '2x4',
        explanation: 'Ordo m x n berubah menjadi n x m saat di-transpose. Jadi 4x2 menjadi 2x4.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q3-8',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Bandingkan dua matriks berikut, apakah mereka sama?',
        options: ['A=[[1,2],[3,4]], B=[[1,2],[3,4]]', 'A=[1,2], B=[[1],[2]]', 'A=[[0,0]], B=[[0]]'],
        correctAnswer: {
          'A=[[1,2],[3,4]], B=[[1,2],[3,4]]': 'SAMA',
          'A=[1,2], B=[[1],[2]]': 'TIDAK SAMA',
          'A=[[0,0]], B=[[0]]': 'TIDAK SAMA'
        },
        explanation: 'Meskipun elemennya mirip, jika ordonya berbeda (seperti matriks baris vs kolom), maka mereka tidak sama.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q3-9',
        type: QuestionType.COMPLEX_MC,
        question: 'Manakah pernyataan yang benar tentang Transpose?',
        options: ['Diagonal utama tetap sama', 'Baris jadi kolom', 'Ordo selalu tetap', 'Lambangnya A^T'],
        correctAnswer: ['Diagonal utama tetap sama', 'Baris jadi kolom', 'Lambangnya A^T'],
        explanation: 'Pada matriks persegi, elemen diagonal utama tidak berubah posisi saat di-transpose. Ordo hanya tetap jika matriksnya persegi.',
        difficulty: Difficulty.HARD
      }
    ]
  },
  {
    id: 'stage-4',
    title: 'Lembah Operasi Matriks',
    description: 'Menguasai perhitungan dasar dan lanjutan antar matriks.',
    subTopics: [
      {
        id: 'st4-1',
        title: 'Penjumlahan Matriks',
        content: `Dua matriks dapat dijumlahkan jika memiliki ordo yang sama. Cara menjumlahkannya adalah dengan menjumlahkan elemen-elemen yang seletak.
        
A + B = C, di mana cᵢⱼ = aᵢⱼ + bᵢⱼ.`,
        examples: [
          { label: 'A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]]', data: [[1, 2], [3, 4]] },
          { label: 'A + B = [[6, 8], [10, 12]]', data: [[6, 8], [10, 12]] }
        ]
      },
      {
        id: 'st4-2',
        title: 'Pengurangan Matriks',
        content: `Sama seperti penjumlahan, pengurangan dua matriks hanya bisa dilakukan jika ordonya sama. Kurangkan elemen-elemen yang seletak.
        
A - B = C, di mana cᵢⱼ = aᵢⱼ - bᵢⱼ.`,
        examples: [
          { label: 'A = [[5, 5]], B = [[2, 3]]', data: [[5, 5]] },
          { label: 'A - B = [[3, 2]]', data: [[3, 2]] }
        ]
      },
      {
        id: 'st4-3',
        title: 'Perkalian Skalar',
        content: `Perkalian skalar adalah perkalian antara bilangan real (k) dengan sebuah matriks. Semua elemen dalam matriks dikalikan dengan bilangan k tersebut.
        
k × A = [k × aᵢⱼ]`,
        examples: [
          { label: 'k = 2, A = [[1, 3], [4, 0]]', data: [[1, 3], [4, 0]] },
          { label: '2A = [[2, 6], [8, 0]]', data: [[2, 6], [8, 0]] }
        ]
      },
      {
        id: 'st4-4',
        title: 'Perkalian Dua Matriks',
        content: `Dua matriks A (m x n) dan B (p x q) dapat dikalikan jika n = p (jumlah kolom A = jumlah baris B). Hasilnya adalah matriks berordo m x q.
        
Caranya: Kalikan baris matriks A dengan kolom matriks B, lalu jumlahkan hasilnya.`,
        examples: [
          { label: 'A = [[1, 2]], B = [[3], [4]]', data: [[1, 2]] },
          { label: 'A × B = [[(1*3)+(2*4)]] = [[11]]', data: [[11]] }
        ]
      },
      {
        id: 'st4-5',
        title: 'Pemangkatan Matriks',
        content: `Pemangkatan matriks hanya berlaku untuk matriks persegi. A² artinya A × A, A³ artinya A × A × A, dan seterusnya.
        
Ingat: A² ≠ elemen dikuadratkan satu per satu, melainkan hasil perkalian matriks tersebut dengan dirinya sendiri.`,
        examples: [
          { label: 'A = [[1, 1], [0, 1]]', data: [[1, 1], [0, 1]] },
          { label: 'A² = [[1, 2], [0, 1]]', data: [[1, 2], [0, 1]] }
        ]
      }
    ],
    quizzes: [
      {
        id: 'q4-1',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Syarat mutlak agar dua matriks dapat dijumlahkan adalah...',
        options: ['Ordo harus sama', 'Harus matriks persegi', 'Elemen harus positif', 'Jumlah baris bebas'],
        correctAnswer: 'Ordo harus sama',
        explanation: 'Hanya matriks dengan dimensi identik yang elemen seletaknya bisa dijumlahkan.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q4-2',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Hasil dari 3 × [[1, 2], [0, 4]] adalah [[3, x], [0, 12]]. Nilai x adalah...',
        correctAnswer: '6',
        explanation: '3 dikalikan elemen 2 di baris 1 kolom 2 menghasilkan 6.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q4-3',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Jika A (2x3) dikali B (3x4), maka matriks C hasilnya berordo...',
        options: ['2x4', '3x3', '2x3', '4x2'],
        correctAnswer: '2x4',
        explanation: 'Hasil perkalian mengambil jumlah baris matriks pertama dan jumlah kolom matriks kedua.',
        difficulty: Difficulty.EASY
      },
      {
        id: 'q4-4',
        type: QuestionType.COMPLEX_MC,
        question: 'Manakah operasi matriks yang hasilnya dipengaruhi oleh ordo?',
        options: ['Penjumlahan', 'Pengurangan', 'Perkalian Dua Matriks', 'Transpose'],
        correctAnswer: ['Penjumlahan', 'Pengurangan', 'Perkalian Dua Matriks'],
        explanation: 'Penjumlahan/Pengurangan butuh ordo sama, Perkalian butuh Kolom A = Baris B.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q4-5',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Selesaikan operasi skalar berikut!',
        options: ['2 * [[1,2]]', '1/2 * [[4,8]]', '0 * [[9,9]]'],
        correctAnswer: {
          '2 * [[1,2]]': '[[2,4]]',
          '1/2 * [[4,8]]': '[[2,4]]',
          '0 * [[9,9]]': '[[0,0]]'
        },
        explanation: 'Setiap elemen dikalikan langsung dengan angka skalarnya.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q4-6',
        type: QuestionType.FILL_IN_BLANKS,
        question: 'Matriks A² didapat dengan mengalikan matriks A dengan ...',
        correctAnswer: 'A',
        explanation: 'Pemangkatan matriks didefinisikan sebagai perkalian berulang matriks itu sendiri.',
        difficulty: Difficulty.MEDIUM
      },
      {
        id: 'q4-7',
        type: QuestionType.MULTIPLE_CHOICE,
        question: 'Matriks A berordo 2x2. Apakah A² bisa dihitung?',
        options: ['Bisa', 'Tidak Bisa', 'Hanya jika elemennya 1', 'Hanya jika matriks nol'],
        correctAnswer: 'Bisa',
        explanation: 'Pemangkatan bisa dilakukan selama matriks tersebut adalah matriks persegi.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q4-8',
        type: QuestionType.DRAG_AND_DROP,
        question: 'Cocokkan hasil perkalian matriks A [[1,0],[0,1]] dengan matriks berikut!',
        options: ['A * [[2,3],[4,5]]', 'A * [[0,0],[0,0]]', 'A * A'],
        correctAnswer: {
          'A * [[2,3],[4,5]]': '[[2,3],[4,5]]',
          'A * [[0,0],[0,0]]': '[[0,0],[0,0]]',
          'A * A': '[[1,0],[0,1]]'
        },
        explanation: 'Matriks Identitas dikalikan matriks lain tetap menghasilkan matriks itu sendiri.',
        difficulty: Difficulty.HARD
      },
      {
        id: 'q4-9',
        type: QuestionType.COMPLEX_MC,
        question: 'Manakah pernyataan yang benar tentang perkalian matriks (A × B)?',
        options: ['Umumnya A x B ≠ B x A', 'Bisa dikalikan jika kolom A = baris B', 'Hasil ordo m x q', 'Dibuat dengan tambah elemen seletak'],
        correctAnswer: ['Umumnya A x B ≠ B x A', 'Bisa dikalikan jika kolom A = baris B', 'Hasil ordo m x q'],
        explanation: 'Perkalian matriks tidak komutatif, butuh kesamaan dimensi tengah, dan hasilnya dimensi luar.',
        difficulty: Difficulty.HARD
      }
    ]
  }
];

export const ACHIEVEMENTS: { [key: string]: { name: string, description: string, icon: string } } = {
  'flash': {
    name: 'Kilat (Flash)',
    description: 'Menjawab 5 soal benar dalam waktu cepat.',
    icon: 'Zap'
  },
  'grandmaster': {
    name: 'Grandmaster',
    description: 'Menyelesaikan semua level dalam tingkat kesulitan HARD.',
    icon: 'Crown'
  },
  'scientist': {
    name: 'Ilmuwan (Scientist)',
    description: 'Melakukan 10 eksperimen berbeda di Matrix Lab.',
    icon: 'FlaskConical'
  }
};

export const STORY_DATA = {
  intro: "Zaman dahulu, Pulau Mathemagica adalah pusat pengetahuan dunia. Namun, sebuah badai misterius mengacak-acak Grid Utama pulau tersebut. Hanya sang Penjelajah Matriks yang bisa menyusun kembali elemen-elemen yang berantakan ini!",
  characterName: "Axi",
  dialogues: {
    welcome: "Selamat datang kembali, Penjelajah! Siap menembus batas dimensi matriks hari ini?",
    mapIntro: "Peta ini adalah kunci menuju inti kerajaan. Setiap kuil menyimpan rahasia matematika yang luar biasa.",
    stageStart: "Matriks di depanku terasa bergetar... Fokuslah, tantangan ini akan menguji ketajaman logika kita!",
    stageComplete: "Luar biasa! Energi matriks mengalir dalam dirimu. Sejarah baru telah tertulis hari ini!",
    streakHigh: "Ketukan mantap! Kamu sedang berada dalam 'flow' matematika yang sempurna. Jangan berhenti!",
    quizCorrect: "Tepat sekali! Kode dimensi telah terpecahkan.",
    quizWrong: "Jangan menyerah. Matriks selalu memberikan kesempatan kedua bagi mereka yang mau belajar.",
    labIntro: "Selamat datang di Lab Matrix. Di sini, kamu adalah arsitek dari dimensimu sendiri. Eksperimenlah sesukamu!"
  }
};

export const REWARDS = [
  { id: 'badge-1', name: 'Grid Novice', xp: 20, icon: '🔰' },
  { id: 'badge-2', name: 'Matrix Apprentice', xp: 50, icon: '🌀' },
  { id: 'badge-3', name: 'Order Master', xp: 80, icon: '⚡' },
];
