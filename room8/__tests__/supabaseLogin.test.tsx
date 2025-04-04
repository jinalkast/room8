describe('Supabase Login Performance', () => {
  it('measures the average execution time of signInWithPassword', async () => {
    const NUM_RUNS = 50;
    // const times: number[] = [];
    // const supabase = createClient('https://<your_project_id>.supabase.co', '<your_anon_key>');

    // for (let i = 0; i < NUM_RUNS; i++) {
    //   // Sign out before each login attempt to ensure a fresh start
    //   await supabase.auth.signOut();

    //   const start = performance.now();

    //   const { error } = await supabase.auth.signInWithPassword({email: 'speed@test.com', password: 'speed'
    //   });

    //   if (!error) {
    //     times.push(performance.now() - start);
    //   }
    //   if (error) {
    //     console.error(`Login failed on attempt ${i + 1}:`, error);
    //   }
    //   await new Promise(resolve => setTimeout(resolve, 250));
    // }

    // const averageTime = times.reduce((a, b) => a + b, 0) / NUM_RUNS;
    // console.log('execution times: ', times);
    // console.log(`Average execution time: ${averageTime.toFixed(2)} ms`);

    // expect(averageTime).toBeGreaterThan(0);
    expect(true).toBe(true); // Placeholder since don't want this running on the CI
  }, 300000); // Set timeout to 5 minutes
});
