



INSERT INTO public.user VALUES ('testuser', 'test@gmail.com', '$2b$12$TjDVnr8KZrnOUfG8b9C.6eTNMZG5OxMASkanW8/e6SgTtfvENn5s2', '5627c307-2175-4b8c-a796-001710ed414c') ON CONFLICT DO NOTHING;

INSERT INTO public.food_type VALUES(1,'Healthy') ON CONFLICT DO NOTHING;
INSERT INTO public.food_type VALUES(2,'Veg') ON CONFLICT DO NOTHING;
INSERT INTO public.food_type VALUES(3,'Non-veg') ON CONFLICT DO NOTHING;
INSERT INTO public.food_type VALUES(4,'Veg dessert') ON CONFLICT DO NOTHING;
INSERT INTO public.food_type VALUES(5,'Non-Veg dessert') ON CONFLICT DO NOTHING;


INSERT INTO public.recipe VALUES (1, 'a bit different  breakfast pizza', '[''prepared pizza crust'', ''sausage patty'', ''eggs'', ''milk'', ''salt and pepper'', ''cheese'']', '[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]', '5627c307-2175-4b8c-a796-001710ed414c', '2022-09-21 16:58:23', NULL, 2) ON CONFLICT DO NOTHING;