import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router';
import { useTranslation } from "react-i18next";
import {Link} from "react-router-dom";

import Form from "../../../components/Form";

import logo from '../../../assets/images/logo.png';

import { columns } from "./column";
import {login_User} from "./service";
import {useAuth} from "../../../global";
import routerLinks from "../../../utils/routerLinks";

export default (props) => {
  const langPrefix = 'routes.Auth.Login';
  const { t } = useTranslation();
  const auth = useAuth();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    auth.logout();
  }, []);

  const submit = async (values) => {
    try {
      setLoading(true);
      const {data} = await login_User(values);
      auth.login(data);
      setLoading(false);
      // auth.login({
      //   avatar: "/storage/avatar.jpg",
      //   bio: "Eveniet voluptatem alias aut molestiae at id. Repellat modi omnis tenetur eos qui et rerum. Quo ipsam vel quo soluta aliquid eaque molestiae. Ad saepe non iusto. Vel asperiores nam voluptatum corporis totam et et. Praesentium iste dolores beatae sit illo et provident. Culpa ipsum eveniet qui ea. Vitae dolorum nesciunt rem architecto sed totam. Alias dolorem enim tempore et. Voluptatem quia perspiciatis esse veniam a assumenda possimus. Quam vero voluptatibus repellendus laborum. Dignissimos totam molestiae a numquam ab delectus quis. Est alias molestiae ab occaecati. Non quaerat corporis in vitae recusandae eaque commodi quas. Quidem omnis sunt eos esse id et. Quis consectetur ut soluta veritatis ut est consectetur. Quia nostrum cum eos. Dignissimos natus explicabo omnis. Fugiat quia eum rem consequatur non nesciunt et. Fugit qui quae occaecati excepturi consequatur facere quidem. Quia laudantium esse sint ullam ipsa dolorum. Commodi id qui cum. Doloremque eaque dolorum libero ut. Magni ipsam aut at molestiae. Aut officia repellendus non odio hic est dolor. Rerum maxime nobis voluptatem. Sint magnam animi occaecati ut. Dicta sapiente hic beatae voluptas debitis quos. Error minima ipsum tempore laborum odio explicabo et quibusdam. Dolores maxime soluta excepturi sed. Culpa aspernatur reprehenderit officiis beatae molestias dolorem. Minus omnis aperiam sit quisquam reprehenderit et aut. Ratione est blanditiis sit sunt iure similique soluta. Labore aut aliquam et quod et sint eos odit. Facilis perferendis nihil sit ea et. Adipisci tempora non veniam quibusdam et ut. Qui sint quia et ab. Ea illum officiis ut molestiae est necessitatibus iusto. Accusamus doloremque doloribus praesentium voluptatibus quia quam.",
      //   created_at: "2020-12-08T17:59:04.000000Z",
      //   email: "admin@admin.com",
      //   email_verified_at: "2020-12-24T09:20:51.000000Z",
      //   expires_in: 1608890186000,
      //   id: 1,
      //   name: "Administrator",
      //   permissions: [],
      //   role_id: 1,
      //   setting: {image_logo: "/storage/logo1.png", name_website: "Laravel React Jquery", keyword_website: "HTML,CSS,JavaScript,SQL,PHP,jQuery,XML,DOM,Bootstr…,examples,exercises,source code,colors,demos,tips", description_website: "Well organized and easy to understand Web building…cript, SQL, PHP, Python, Bootstrap, Java and XML."},
      //   status: 1,
      //   token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC92MVwvYXV0aCIsImlhdCI6MTYwODg4NjU4NiwiZXhwIjoxNjA4ODkwMTg2LCJuYmYiOjE2MDg4ODY1ODYsImp0aSI6IjdHNE1NR1JUd29kNVZqSzkiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.-cvJIwUcCfbu19Mct_qdIzC_JYsC8-_B1kJ3RwEG9Hw",
      //   updated_at: "2020-12-15T22:15:31.000000Z",
      // });
      history.replace(routerLinks('Profile'));
    }
    catch(err) {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-50">
        <img src={logo} height="100" alt="" />
        <h3>{t(langPrefix + '.title')}</h3>
        <p><strong>{t(langPrefix + '.subTitle')}</strong></p>
      </div>
      <Form values={{ email: "admin@admin.com", password: "password", remember: [true], }} columns={columns({langPrefix, t})} loading={loading} textSubmit={t(langPrefix + '.signUp')} handSubmit={submit}/>
      <div className="text-center mt-30">
        <p>{t(langPrefix + '.dontAccount')} <Link to='/auth/register'>{t(langPrefix + '.signUp')}</Link></p>
      </div>
    </div>
  );
};
