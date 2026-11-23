import { test, expect, openMenuIfCollapsed } from "./fixtures";

const NAME = "Euclides Rafael Marin";

test.describe("rutas", () => {
  test("una ruta desconocida redirige al inicio", async ({ page }) => {
    await page.goto("/no-existe");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(NAME);
  });

  test("la ruta retirada /experience redirige al inicio", async ({ page }) => {
    await page.goto("/experience");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(NAME);
  });
});

test.describe("idioma y tema", () => {
  test("cambiar a inglés traduce la página, actualiza lang y persiste tras recargar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await openMenuIfCollapsed(page);
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Full Stack Developer specialized in React & Node.js");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Full Stack Developer specialized in React & Node.js");
  });

  test.describe("sin preferencia guardada", () => {
    test.use({ theme: null });

    test.describe("con el sistema en claro", () => {
      test.use({ colorScheme: "light" });

      test("arranca en tema claro", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator("html")).not.toHaveClass(/dark/);
      });
    });

    test.describe("con el sistema en oscuro", () => {
      test.use({ colorScheme: "dark" });

      test("arranca en tema oscuro", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("html")).toHaveClass(/dark/);
      });
    });
  });

  test("cambiar a tema claro quita la clase dark y persiste tras recargar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await openMenuIfCollapsed(page);
    await page.getByRole("button", { name: "Modo claro" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});

test.describe("contacto", () => {
  test("enviar vacío muestra los tres errores de validación sin llamar a EmailJS", async ({ page, emailRequests }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Enviar Mensaje" }).click();
    await expect(page.getByText("El nombre debe tener al menos 2 caracteres.")).toBeVisible();
    await expect(page.getByText("Debe ser un email válido.")).toBeVisible();
    await expect(page.getByText("El mensaje debe tener al menos 10 caracteres.")).toBeVisible();
    expect(emailRequests).toHaveLength(0);
  });

  test("un envío válido llama a EmailJS con los datos del formulario y muestra el éxito", async ({ page, emailRequests }) => {
    await page.goto("/contact");
    await page.getByLabel("Nombre").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Mensaje").fill("Quiero hablar sobre un proyecto.");
    await page.getByRole("button", { name: "Enviar Mensaje" }).click();
    await expect(page.getByText("¡Mensaje enviado!")).toBeVisible();
    expect(emailRequests).toHaveLength(1);
    expect(emailRequests[0]!.postDataJSON()).toMatchObject({
      service_id: "service_characterization",
      template_id: "template_characterization",
      user_id: "public_characterization",
      template_params: { name: "Ada Lovelace", email: "ada@example.com", message: "Quiero hablar sobre un proyecto." },
    });
  });

  test.describe("con EmailJS caído", () => {
    test.use({ emailStatus: 500 });

    test("un envío fallido muestra el error con el email de respaldo", async ({ page }) => {
      await page.goto("/contact");
      await page.getByLabel("Nombre").fill("Ada Lovelace");
      await page.getByLabel("Email").fill("ada@example.com");
      await page.getByLabel("Mensaje").fill("Quiero hablar sobre un proyecto.");
      await page.getByRole("button", { name: "Enviar Mensaje" }).click();
      await expect(page.getByText(/No se pudo enviar el mensaje\. Escríbeme directamente a .+@.+/)).toBeVisible();
    });
  });
});

test.describe("con WordPress caído", () => {
  test.use({ wordpressStatus: 500 });

  test("el blog muestra el mensaje de error", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByText("No se pudieron cargar los artículos. Inténtalo de nuevo más tarde.")).toBeVisible();
  });

  test("los proyectos se muestran igual, sin artículos asociados", async ({ page }) => {
    await page.goto("/projects");
    for (const title of ["Taskly", "OM Distribution", "SG-Remesas", "Salvia"]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: /Diseño del Task Manager/ })).toHaveCount(0);
  });
});

test.describe("menú móvil", () => {
  test("se abre con el botón y se cierra con Escape", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "el drawer solo existe en móvil");
    await page.goto("/");
    const drawer = page.locator("aside");
    const isInert = () => drawer.evaluate((el) => (el as HTMLElement).inert);
    await expect.poll(isInert).toBe(true);
    await page.getByRole("button", { name: "Open Menu" }).click();
    await expect.poll(isInert).toBe(false);
    await expect(drawer.getByRole("link", { name: "Proyectos", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect.poll(isInert).toBe(true);
  });
});
