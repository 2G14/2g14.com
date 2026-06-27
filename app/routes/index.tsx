import { createRoute } from 'honox/factory';

export default createRoute((c) => {
  return c.render(
    <div class="min-h-screen flex items-center justify-center">
      <h1 class="text-3xl font-bold">2g14.com</h1>
    </div>,
    { title: '2g14.com' },
  );
});
