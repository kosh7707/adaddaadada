create database if not exists webtermproject default character set utf8 collate utf8_general_ci;
use webtermproject;

drop table if exists accounts cascade;
create table accounts (
    account_id      int not null AUTO_INCREMENT,
    user_email      varchar(30) unique not null,
    user_pw         varchar(255) not null,
    created_date    timestamp default current_timestamp,
    last_login      timestamp default current_timestamp,
    primary key (account_id)
) ENGINE=InnoDB default CHARSET=utf8;

drop table if exists characters cascade;
create table characters (
    character_id    int not null AUTO_INCREMENT, 
    account_id      int not null, 
    item_level      float not null, 
    character_name  varchar(20) not null, 
    primary key (character_id),
    foreign key (account_id) references accounts(account_id) on delete cascade
) ENGINE=InnoDB default CHARSET=utf8;

drop table if exists userInfo cascade;
create table userInfo (
    account_id          int not null,
    nickname            varchar(20) not null, 
    main_character_id   int default null,
    primary key (account_id),
    foreign key (account_id)        references accounts(account_id) on delete cascade, 
    foreign key (main_character_id) references characters(character_id) on delete set null
) ENGINE=InnoDB default CHARSET=utf8;

drop table if exists posts cascade;
create table posts (
    post_id     int not null AUTO_INCREMENT, 
    title       varchar(255) not null, 
    content     text not null, 
    author_id   int not null,
    view_count  int not null default 0,
    created_at  timestamp default current_timestamp, 
    updated_at  timestamp default current_timestamp on update current_timestamp,
    primary key (post_id),
    foreign key (author_id) references accounts(account_id) on delete cascade
) ENGINE=InnoDB default CHARSET=utf8;

drop table if exists comments cascade;
create table comments (
    comment_id  int not null AUTO_INCREMENT, 
    post_id     int not null, 
    content     text not null, 
    author_id   int not null, 
    created_at  timestamp default current_timestamp, 
    updated_at  timestamp default current_timestamp on update current_timestamp,
    primary key (comment_id),
    foreign key (post_id)   references posts(post_id) on delete cascade,
    foreign key (author_id) references accounts(account_id) on delete cascade
) ENGINE=InnoDB default CHARSET=utf8;

drop table if exists likes cascade;
create table likes (
    post_id int not null,
    like_id int not null,
    primary key (post_id, like_id),
    foreign key (post_id) references posts(post_id) on delete cascade,
    foreign key (like_id) references accounts(account_id) on delete cascade
) ENGINE=InnoDB default CHARSET=utf8;
