export const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('Error creating set:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
}